"use client";
import { Inbox, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { UploadButton } from "@/lib/uploadthing";

type Props = {};

function FileUpload({}: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  return (
    <div className="p-2 bg-white rounded-xl">
      <>
        <UploadButton
          endpoint="pdfUploader"
          onClientUploadComplete={(res) => {
            console.log("Files: ", res[0]);
          }}
          onUploadError={(error: Error) => {}}
        />
      </>
    </div>
  );
}

export default FileUpload;
