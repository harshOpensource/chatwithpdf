"use client";
import { Inbox, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { UploadButton } from "@/lib/uploadthing";
import axios from "axios";

type Props = {};

type uploadFile = {
  key: string;
  name: string;
  url: string;
};

const FileUpload = ({}: Props) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
      pdf_url,
    }: {
      file_key: string;
      file_name: string;
      pdf_url: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
        pdf_url,
      });

      return response.data;
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl items-center w-full justify-center flex flex-col py-5">
      <Inbox className="w-12 h-12 text-blue-500" />
      <p className="mt-2 text-sm text-slate-400 mb-4">Select PDF Here</p>
      <UploadButton
        appearance={{
          allowedContent: {},
          button: {
            color: "white",
            backgroundColor: "darkslategrey",
          },
          container: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          },
        }}
        endpoint="pdfUploader"
        onClientUploadComplete={(res: uploadFile[]) => {
          mutate(
            {
              file_key: res[0].key,
              file_name: res[0].name,
              pdf_url: res[0].url,
            },
            {
              onSuccess: (data) => {
                router.push(`/chat/${data.chat_id}`);
              },
              onError: (error) => {
                console.log("Error: ", error);
              },
            }
          );
        }}
        onUploadError={(error: Error) => {
          console.log("Error: ", error);
        }}
      />
    </div>
  );
};

export default FileUpload;
