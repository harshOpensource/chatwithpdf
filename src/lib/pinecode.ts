import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import axios from "axios";
import fs from "fs";
import path from "path";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export async function loadPdftoPinecone(
  file_key: string,
  file_url: string,
  file_name: string
) {
  // 1 obtain pdf
  console.log("downloading file from uploadthing");

  const response = await axios.get(file_url, { responseType: "arraybuffer" }); // Ensure the response type is arraybuffer for binary data
  const pdfData = Buffer.from(response.data, "binary"); // Create buffer from binary data

  // Check if temp directory exists, if not create it
  const tempDirPath = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDirPath)) {
    fs.mkdirSync(tempDirPath);
  }

  // Save the downloaded file to a temporary location
  const tempFilePath = path.join(tempDirPath, file_name);
  fs.writeFileSync(tempFilePath, pdfData);

  // Load the PDF file using the local file path
  const pdfLoader = new PDFLoader(tempFilePath);
  const pages = (await pdfLoader.load()) as PDFPage[];

  // split and segment the pdf
  const docs = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(docs.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chatwithpdf");
  const namespace = pineconeIndex.namespace(convertToAscii(file_key));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  // Handle the loaded PDF pages
  console.log("Loaded", pages.length, "pages from PDF:", file_name);
  // Do whatever processing you need to do with the pages

  // Cleanup: Remove the temporary file
  fs.unlinkSync(tempFilePath);

  return docs[0];
}

async function embedDocument(doc: Document) {
  try {
    if (!doc.pageContent) {
      throw new Error("Document page content is undefined");
    }
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { metadata, pageContent } = page;
  pageContent = pageContent.replace(/\n/g, "");
  //split the document
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
