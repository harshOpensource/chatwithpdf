import Chat from "@/components/chat";
import ChatSideBar from "@/components/chat-sidebar";
import PDFViewer from "@/components/pdf-viwer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(params.chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find(
    (chat) => chat.id === parseInt(params.chatId)
  );

  const isPro = true;

  return (
    <div className="flex max-h-screen">
      <div className="flex w-full max-h-screen">
        {/* chat sidebar */}
        <div className="flex-[2] max-w-xs">
          <ChatSideBar
            chats={_chats}
            chatId={parseInt(params.chatId)}
            isPro={isPro}
          />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat */}
        <div className="flex-[3] min-h-screen border-l-4 border-l-slate-200">
          <Chat chatId={parseInt(params.chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
