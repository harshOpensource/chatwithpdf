"use client";

import { Button } from "@/components/ui/button";
import { UserButton, auth, currentUser, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const isAuth = !!user?.id;
  const isPro = true; // todo check subscription

  let firstChat: any; // todo get the first chat from database

  if (!isLoaded) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  useEffect(() => {
    if (isLoaded === true && isSignedIn === true) {
      toast.dismiss();
      toast.success(`Welcome ${user.firstName} ${user.lastName}!`);
    }
  }, [isLoaded]);
  return (
    <main className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      {isLoaded && isSignedIn && (
        <div className="w-full flex justify-end pt-5 pr-10">
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <div className="flex flex-col gap-5 items-center text-center">
          <div className="flex items-center flex-col gap-4 justify-center">
            <h1 className="text-5xl font-extrabold">Chat With Any Pdf</h1>
          </div>
          {/* Action Buttons */}
          <div className="flex">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat?.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  <Button>Subscription Button</Button>
                </div>
              </>
            )}
          </div>

          {/*  */}

          <div className="max-w-xl text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </div>

          <div className="w-full mt-5">
            {isAuth ? (
              <>File Upload</>
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  Login To get Started
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
