import { useEffect, useRef, useState } from "react";
import ChatMessages from "./chatMessages";

import { UserAuth } from "../context/AuthContext";
import type { ChatId } from "../types/chat";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function MicrophoneComponent({ chatid }: ChatId) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [fulltranscript, setTranscript] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getLang', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ chatid }),
        });
        const fetchedData = await response.json();
        var lang = fetchedData['lang'];
        setLanguage(lang);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [chatid]);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    //recognitionRef.current.lang = 'zh-CN';
    recognitionRef.current.lang = language;
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const curtranscript = event.results[event.results.length - 1][0].transcript;
      console.log(event.results[event.results.length - 1])
      //console.log(event.results[event.results.length - 1][0].isFinal)
      if (event.results[event.results.length - 1].isFinal && curtranscript != "") {
        //console.log(event.results);
        fulltranscript.push(curtranscript);
      }
    };

    recognitionRef.current.start();
  };

  function joinStringsLowercase(arr:any) {
    if (arr.length === 0) {
      return "";
    } else {
      const firstWord = arr[0];
      const restWords = arr.slice(1).map((word:any)   => word.toLowerCase());
      return firstWord + " " + restWords.join(" ");
    }
  }  

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
      let totalTranscript = joinStringsLowercase(fulltranscript);
      console.log('total transcript:', totalTranscript);
      const fetchData = async () => {
        try {
          const response = await fetch('/api/getResponse', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ "text": totalTranscript}),
          });
          const fetchedData = await response.json();
          let message = fetchedData['response'];
          console.log('message1:', message)
          console.log('totalTranscript2:', totalTranscript)
          console.log('botMessage:', botMessage)
          if (totalTranscript != "" && message != "") {
            chatHistory.push({ role: "Human", content: totalTranscript });
            chatHistory.push({ role: "AI", content: message });
          }
          console.log('chatHistory:', chatHistory)
          setTranscript([]);
          setBotMessage("");
        } catch (error) {
          console.error('Error fetching data:', error);
        } 
      }
      fetchData();
      /*
      console.log('totalTranscript2:', totalTranscript)
      console.log('botMessage:', botMessage)
      if (totalTranscript != "" && botMessage != "") {
        chatHistory.push({ role: "Human", content: totalTranscript });
        chatHistory.push({ role: "AI", content: botMessage });
      }
      console.log('chatHistory:', chatHistory)
      setTranscript([]);
      setBotMessage("");
      */
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/openChat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ "chatid": chatid }),
        });
        const fetchedData = await response.json();
        var messages = fetchedData['chatHistory'];
        setChatHistory(messages);
        console.log('chatHistory1:', messages)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [chatid]);

  return (
    <main className="flex flex-row min-h-screen justify-around py-1 px-4 fixed space-x-2">
      <>
     
        <ChatMessages chatHistory={chatHistory} />
     
        <div className="flex flex-col items-center w-full fixed bottom-0 pb-3">
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
      <ChatMessages chatHistory={chatHistory} />
    </main>
  );
}
