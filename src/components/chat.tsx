"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { useChat } from "ai/react";
import MessageList from "./message-list";

type Props = {
  chatId: number;
};

function Chat({ chatId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden scrollbar-hide px-4"
      id="message-container"
    >
      <div className="flex-[0] top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat with your Pdf</h3>
      </div>
      <div className="flex-[1] overflow-scroll scrollbar-hide py-8">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <div className="flex-[0] bottom-0 inset-x-0 px-2 py-4 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="w-full"
            />
            <Button className="bg-blue-600 ml-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
