import Image from "next/image";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import type { ChatMessagesProps } from "../types/chat";


export default function ChatMessages({ chatHistory }: ChatMessagesProps) {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(false);

  return (
    // <div className=" z-10 mt-10  lg:mt-20 pt-1 px-6  w-full h-96 overflow-y-auto lg:w-3/4 xl:w-2/4 border-0 lg:border-x-2 lg:border-white bg-white rounded-md">
    <div className=" px-6 pr-2 h-screen w-full pb-20 pl-10 overflow-y-auto ">
      {(chatHistory && chatHistory.length === 0) || (!chatHistory) ? (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
          <h2 className=" text-xl text-center mt-12 animate-none lg:animate-bounce">
            Loading...
          </h2>
        </div>
      ) : (
        chatHistory.map((message, index) => (
          <div key={index} className="my-5 lg:my-10">
            {message.role === "AI" ? (
              <div className="flex mb-2 lg:mb-4">
                <Image src="/bot.svg" alt="Robot Icon" width={20} height={20} priority />
                <span className="ml-2 text-md lg:text-lg font-semibold text-blue-500">DialogueAI:</span>
              </div>
            ) : (
              <div className="flex mb-2 lg:mb-4">
                <Image src="/face.svg" alt="Face Icon" width={18} height={18} priority />
                <span className="ml-2 text-md lg:text-lg font-semibold text-teal-500">You:</span>
              </div>
            )}
            <span className="text-md lg:text-lg">{message.content}</span>
          </div>
        ))
      )}
      
    </div>
    
  
  );
}