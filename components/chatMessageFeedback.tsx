import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import type { ChatMessagesProps } from "../types/chat";


export default function ChatMessages({ chatHistory, feedback }: ChatMessagesProps) {
  const { user, googleSignIn, logOut } = UserAuth() || {};

  const [loading, setLoading] = useState(true);

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
    scrollFeedbackToBottom();
  }, [chatHistory.length]); // Watch for changes in chat history length

  // Timer to change loading state after 40 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20000); // 40 seconds in milliseconds

    return () => clearTimeout(timer);
  }, []);

  const parseMessage = (message: any) => {
    if (typeof message !== "string") {
      message = String(message); // Ensure message is a string
    }

    // Debugging: Log the message to be parsed
    console.log("Parsing message:", message);

    const originalPhraseMatch = message.match(/ORIGINAL PHRASE:\s*(.*?)(?=PROBLEMS:)/s);
    const problemsMatch = message.match(/PROBLEMS:\s*(.*?)(?=CORRECTED PHRASE:)/s);
    const correctedPhraseMatch = message.match(/CORRECTED PHRASE:\s*(.*)$/s);

    // Debugging: Log the regex matches
    console.log("Original Phrase Match:", originalPhraseMatch);
    console.log("Problems Match:", problemsMatch);
    console.log("Corrected Phrase Match:", correctedPhraseMatch);

    const originalPhrase = originalPhraseMatch ? originalPhraseMatch[1].trim() : "";
    const problems = problemsMatch ? problemsMatch[1].trim() : "";
    const correctedPhrase = correctedPhraseMatch ? correctedPhraseMatch[1].trim() : "";

    const grammaticalErrors = problems.match(/Grammatical Errors:\s*(.*?)(?=(Tone Errors|$))/s);
    const toneErrors = problems.match(/Tone Errors:\s*(.*?)(?=(Vocabulary Errors|$))/s);
    const vocabularyErrors = problems.match(/Vocabulary Errors:\s*(.*)$/s);

    // Debugging: Log the extracted problems
    console.log("Grammatical Errors:", grammaticalErrors);
    console.log("Tone Errors:", toneErrors);
    console.log("Vocabulary Errors:", vocabularyErrors);

    return {
      originalPhrase,
      problems: {
        grammaticalErrors: grammaticalErrors ? grammaticalErrors[1].trim() : "None",
        toneErrors: toneErrors ? toneErrors[1].trim() : "None",
        vocabularyErrors: vocabularyErrors ? vocabularyErrors[1].trim() : "None"
      },
      correctedPhrase
    };
  };

  return (
    <div className="grid grid-cols-8 mb-52 h-screen w-full">
      <div className="col-span-6 px-6 pr-2 pb-52 pl-10 overflow-y-auto bg-white" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <h2 className="text-xl text-center mt-12 animate-none lg:animate-bounce">{loading ? 'Loading..' : 'Assignment Not Started Yet!'}</h2>
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
      <div className="col-span-2 px-6 pr-2 pb-32 pl-10 overflow-y-auto bg-slate-400" ref={feedbackContainerRef}>
        {feedback && feedback.length > 0 ? (
          feedback.map((message, index) => {
            // Debugging: Log the feedback message
            console.log("Feedback message:", message);

            const parsedMessage = parseMessage(message.content);

            // Debugging: Log the parsed message object
            console.log("Parsed message object:", parsedMessage);

            return (
              <div key={index} className="my-5 lg:my-10">
                <div className="flex mb-2 lg:mb-4">
                  <span className="ml-2 text-md lg:text-lg font-semibold text-red-700">Feedback:</span>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="mb-4">
                    <h3 className="font-semibold text-blue-500 mb-2">Original Phrase:</h3>
                    <p className="text-md lg:text-lg text-gray-800">{parsedMessage.originalPhrase}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-red-500 mb-2">Problems:</h3>
                    <ul className="list-disc list-inside text-md lg:text-lg text-gray-800">
                      <li><strong>Grammatical Errors:</strong> {parsedMessage.problems.grammaticalErrors}</li>
                      <li><strong>Tone Errors:</strong> {parsedMessage.problems.toneErrors}</li>
                      <li><strong>Vocabulary Errors:</strong> {parsedMessage.problems.vocabularyErrors}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-500 mb-2">Corrected Phrase:</h3>
                    <p className="text-md lg:text-lg text-gray-800">{parsedMessage.correctedPhrase}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-screen w-full">
            <h2 className="text-xl text-center mt-12 animate-none lg:animate-bounce">{loading ? 'Loading..' : 'No Feedback!'}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
