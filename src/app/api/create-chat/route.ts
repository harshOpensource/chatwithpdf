/* api create chat */

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadPdftoPinecone } from "@/lib/pinecode";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  console.log("correct");
  try {
    const body = await req.json();
    const { file_key, file_name, pdf_url } = body;

    await loadPdftoPinecone(file_key, pdf_url, file_name);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: pdf_url,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    console.log(chat_id);

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
