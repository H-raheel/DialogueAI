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
  //const [recordingComplete, setRecordingComplete] = useState(false);
  const [fulltranscript, setTranscript] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
 // const [language, setLanguage] = useState("");
  const [sentTranscription, setSentTranscription] = useState("");
 
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [feedback, setfeedback] = useState<any>([]);
  let botMessage="";
let fetchedData=({
   
    feedback: "",
   grammar_errors: 0,
   tone_errors: 0,
  vocabulary_errors: 0,
  });
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const recognitionRef = useRef<any>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let timer: number; // Explicitly set the type of timer to number

    if (isRecording) {
      setProgress(0);
      timer = window.setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            window.clearInterval(timer);
            setIsRecording(false);
            return 100;
          }
          return prevProgress + 1; // increment by 1% every 40ms for 4 seconds
        });
      }, 40); // 40ms interval
    }

    // Clear interval on component unmount or if recording stops
    return () => window.clearInterval(timer);
  }, [isRecording]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch('/api/getLang', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //         body: JSON.stringify({ chatid }),
  //       });
  //       const fetchedData = await response.json();
  //       var lang = fetchedData['lang'];
  //       setLanguage(lang);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData(); // Call fetchData when the component mounts
  // }, [chatid]);
  useEffect(() => {
    const fetchData = async () => {
      console.log(chatid);
      setLoading(true);
      try {
        const response = await fetch("/api/openChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ chatid: chatid }),
        });
        const fetchedData = await response.json();
        var messages = fetchedData["chatHistory"];
        setChatHistory(messages);
        console.log("chatHistory1:", messages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [chatid]);
  const startRecording = async () => {
    setIsRecording(true);
    setDisabled(true);
    const fetchData2 = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/record_voice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            output_filename: "test.wav",
            record_seconds: 4,
          }),
        });
        const data = await response.json();
        fulltranscript.push(data.transcription);
        if (fulltranscript[fulltranscript.length-1] != "" ) {
          chatHistory.push({ role: "Human", content: fulltranscript[fulltranscript.length-1] });
          //chatHistory.push({ role: "AI", content: message });
        }
        console.log("trans fethed", data);
        console.log("inside", data.transcription);
       // setSentTranscription(data.transcription);
        console.log("Transcription over heree:", sentTranscription);
        console.log(fulltranscript);
        console.log("data is set noww");
        await stopRecording();
        //  setLanguage(lang);
        //console.log(fetchedData)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    await fetchData2();

    // setTranscript((prevTranscripts: string[]) => [...prevTranscripts, sentTranscription]);

    // recognitionRef.current = new window.webkitSpeechRecognition();
    // //recognitionRef.current.lang = 'zh-CN';
    // recognitionRef.current.lang = language;
    // recognitionRef.current.continuous = true;
    // recognitionRef.current.interimResults = true;

    // // recognitionRef.current.onresult = (event: any) => {
    // //   const curtranscript = event.results[event.results.length - 1][0].transcript;
    // //   console.log(event.results[event.results.length - 1])
    // //   //console.log(event.results[event.results.length - 1][0].isFinal)
    // //   if (event.results[event.results.length - 1].isFinal && curtranscript != "") {
    // //     //console.log(event.results);
    // //     fulltranscript.push(curtranscript);
    // //   }
    // // };

    // recognitionRef.current.start();
  };

  function joinStringsLowercase(arr: any) {
    if (arr.length === 0) {
      return "";
    } else {
      const firstWord = arr[0];
      const restWords = arr.slice(1).map((word: any) => word.toLowerCase());
      return firstWord + " " + restWords.join(" ");
    }
  }

  const stopRecording = async () => {
 
    setIsRecording(false);
    console.log("recstopped");
    console.log(fulltranscript);

    // if (recognitionRef.current) {
    // recognitionRef.current.stop();
   // setRecordingComplete(true);
   // let totalTranscript = joinStringsLowercase(fulltranscript[fulltranscript.length-1]);
   // console.log("total transcript:", totalTranscript);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getResponse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ text: fulltranscript[fulltranscript.length-1] }),
        });
        const fetchedData = await response.json();
        let message = fetchedData["response"];

        console.log("message1:", message);
     //   console.log("totalTranscript2:", totalTranscript);
        //   console.log('botMessage:', botMessage)
        if (fulltranscript[fulltranscript.length-1] != "" && message != "") {
         // chatHistory.push({ role: "Human", content: fulltranscript[fulltranscript.length-1] });
          chatHistory.push({ role: "AI", content: message });
        }
        console.log("chatHistory:", chatHistory);

      botMessage=message;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally{   setDisabled(false);}
    };
    const fetchFeedback = async () => {
      try {
        console.log("sending", fulltranscript[fulltranscript.length-1]);
        const response = await fetch("/api/immediate_feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ text: fulltranscript[fulltranscript.length-1] }),
        });
        const fetched = await response.json();

        console.log("fetched datain feedback", fetched);
        console.log("fetched datain feedback", fetched["feedback"]);
        console.log("transcription", fulltranscript);
        feedback.push({ content: fetched.feedback });
        console.log(feedback);
       fetchedData=(
          {
        feedback: fetched["feedback"],
           grammar_errors: fetched["grammar_errors"],
           tone_errors: fetched["tone_errors"],
          vocabulary_errors: fetched["vocabulary_errors"]
          }
        );
        
        
        // setTranscript([]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const updateDB = async () => {
      console.log(fetchedData);
      try {
        console.log("sending2", fulltranscript[fulltranscript.length-1]);
        const response = await fetch("/api/update_chat_history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            "text": fulltranscript[fulltranscript.length-1],
            "roleplay_ai":botMessage,
            "chatid": chatid,
           "feedback": fetchedData.feedback,
            "grammar_errors": fetchedData.grammar_errors,
            "tone_errors": fetchedData.tone_errors,
            "vocabulary_errors": fetchedData.vocabulary_errors,
          }),
        });
        // const fetched = await response.json();
        // console.log("fetched data", fetched);
        // feedback.push({content:fetchedData.feedback})
        // console.log(feedback)
        // setTranscript([]);
        // setfeedback([]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    await fetchData();
    await fetchFeedback();
     updateDB();
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch('/api/openChat', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //         body: JSON.stringify({ "chatid": chatid }),
  //       });
  //       const fetchedData = await response.json();
  //       var messages = fetchedData['chatHistory'];
  //       setChatHistory(messages);
  //       console.log('chatHistory1:', messages)
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData(); // Call fetchData when the component mounts
  // }, [chatid]);

  return (
    <main className="  mb-7 h-screen w-screen ">
      <div className=" bg-white pb-48">
        <ChatMessages chatHistory={chatHistory} feedback={feedback} />
        <div className="flex flex-col items-center w-full fixed bottom-0 pb-3">
          <button
            onClick={startRecording}
            disabled={disabled}
            className={`mt- m-auto flex items-center justify-center ${
              isRecording || disabled
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-blue-400 hover:bg-blue-500"
            } rounded-full w-20 h-20 focus:outline-none`}
          >
            {isRecording ? (
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
          {isRecording && (
            <div className="w-48 mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${progress}%`,
                    transition: "width 0.04s linear",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className=" bg-gray-300 col-span-2">
      <ChatMessages chatHistory={chatHistory} />
      
      </div> */}
    </main>
  );
}
