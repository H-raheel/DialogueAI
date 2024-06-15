import { useEffect, useState, useRef } from "react";
import ChatMessages from "./chatMessages";

import { UserAuth } from "../context/AuthContext";
import { auth } from "../pages/api/firebase";
import type { ChatId } from "../types/chat";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function MicrophoneComponent({ chatid }: ChatId) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [fulltranscript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const recognitionRef = useRef<any>(null);
  var chatHistory;

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = 'zh-CN';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const curtranscript = event.results[event.results.length - 1][0].transcript;
      //console.log(event.results[event.results.length - 1])
      //console.log(event.results[event.results.length - 1][0].isFinal)
      if (event.results[event.results.length - 1].isFinal && curtranscript != "") {
        //console.log(event.results);
        fulltranscript.push(curtranscript);
      }
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingComplete(true);
      console.log('total transcript:', fulltranscript)
      let totalTranscript = fulltranscript.join(' ');
      setTranscript([]);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-between py-1 px-4 lg:px-0">
      <>
        <ChatMessages chatid={chatid} />
        <div className="flex flex-col items-center w-full fixed bottom-0 pb-3 bg-gray-900">
          <button
            onClick={handleToggleRecording}
            className={`mt-10 m-auto flex items-center justify-center ${
              isRecording ? "bg-red-400 hover:bg-red-500" : "bg-blue-400 hover:bg-blue-500"
            } rounded-full w-20 h-20 focus:outline-none`}
          >
            {isRecording ? (
              <svg
                className="h-12 w-12"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-white"
              >
                <path
                  fill="currentColor"
                  d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                />
              </svg>
            )}
          </button>
        </div>
      </>
    </main>
  );
}
