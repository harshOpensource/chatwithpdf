import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const font = Poppins({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Chat With Pdf",
  description:
    "Chat With Pdf is a AI based SAAS to be used to interact with PDFs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
