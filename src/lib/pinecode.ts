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

async function downloadFile(fileUrl: string) {
  try {
    const response = await axios.get(fileUrl);
    return response.data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
function readFileAsDataURL(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
export async function loadPdftoPinecone(
  file_key: string,
  file_url: string,
  file_name: string
) {
  // 1 obtain pdf
  console.log("downloading file from uploadthing");

  const pdfLoader = new PDFLoader(file_url);
  console.log(pdfLoader, "loader");
  const pages = (await pdfLoader.load()) as PDFPage[];

  console.log("2 step", pages);

  // split and segment the pdf
  const docs = await Promise.all(pages.map(prepareDocument));
  console.log("333333333");

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(docs.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chatwithpdf");
  const namespace = pineconeIndex.namespace(convertToAscii(file_key));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return docs[0];
}

async function embedDocument(doc: Document) {
  try {
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
