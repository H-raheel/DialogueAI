import Image from "next/image";
import { useEffect, useRef } from "react";
import { UserAuth } from "../context/AuthContext";
import type { ChatMessagesProps } from "../types/chat";

export default function ChatMessages({ chatHistory, feedback }: ChatMessagesProps) {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  // const [chatLength, setChatLength] = useState(chatHistory.length);

  // Refs for chat and feedback containers
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const feedbackContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll chat container to bottom
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Function to scroll feedback container to bottom
  const scrollFeedbackToBottom = () => {
    if (feedbackContainerRef.current) {
      feedbackContainerRef.current.scrollTop = feedbackContainerRef.current.scrollHeight;
    }
  };

  // Effect to scroll to bottom when chat history changes
  useEffect(() => {
    scrollChatToBottom();
  }, [chatHistory.length]); // Watch for changes in chat history length

  // Effect to scroll to bottom when feedback changes
  // useEffect(() => {
  //   scrollFeedbackToBottom();
  // }, [feedback.length]);

  return (
    <div className="grid grid-cols-8 mb-52 h-screen w-full">
      <div className="col-span-6 px-6 pr-2 pb-40 pl-10 overflow-y-auto bg-white" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <h2 className="text-xl text-center mt-12 animate-none lg:animate-bounce">
              Loading..
            </h2>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className="my-5 lg:my-10">
              <div className="flex mb-2 lg:mb-4">
                <Image src={message.role === "AI" ? "/bot.svg" : "/face.svg"} alt="Icon" width={20} height={20} priority />
                <span className="ml-2 text-md lg:text-lg font-semibold text-blue-500">
                  {message.role === "AI" ? "DialogueAI:" : "You:"}
                </span>
              </div>
              <span className="text-md lg:text-lg">{message.content}</span>
            </div>
          ))
        )}
      </div>
      <div className="col-span-2 px-6 pr-2 pb-28 pl-10 overflow-y-auto bg-slate-400" ref={feedbackContainerRef}>
        {feedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <h2 className="text-xl text-center mt-12 animate-none lg:animate-bounce">
              Getting Feedback...
            </h2>
          </div>
        ) : (
          feedback.map((message, index) => (
            <div key={index} className="my-5 lg:my-10">
              <div className="flex mb-2 lg:mb-4">
                <span className="ml-2 text-md lg:text-lg font-semibold text-red-700">Feedback:</span>
              </div>
              <span className="text-md lg:text-lg">{message.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
