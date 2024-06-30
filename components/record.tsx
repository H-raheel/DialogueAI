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
  const [fulltranscript, setTranscript] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [sentTranscription,setSentTranscription]=useState("")
  const [botMessage, setBotMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [feedback, setfeedback] = useState<any>([]);
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const recognitionRef = useRef<any>(null);
   const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [disabled,setDisabled]=useState(false);



  useEffect(() => {
    let timer: number; // Explicitly set the type of timer to number

    if (isRecording) {
      setProgress(0);
      timer = window.setInterval(() => {
        setProgress(prevProgress => {
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

  const startRecording = async()  => {
    setIsRecording(true);
    setDisabled(true);
    const fetchData2 = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/record_voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ output_filename: "test.wav",
        record_seconds:4 }),
        });
        const data= await response.json();  
        fulltranscript.push(data.transcription)
        console.log("trans fethed",data)
        console.log("inside",data.transcription)
       setSentTranscription(data.transcription)
        console.log('Transcription over heree:', sentTranscription);
      console.log(fulltranscript)
      console.log("data is set noww")
      await stopRecording()
      //  setLanguage(lang);
      //console.log(fetchedData)
      } catch (error) {
        console.error('Error fetching data:', error);
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

  function joinStringsLowercase(arr:any) {
    if (arr.length === 0) {
      return "";
    } else {
      const firstWord = arr[0];
      const restWords = arr.slice(1).map((word:any)   => word.toLowerCase());
      return firstWord + " " + restWords.join(" ");
    }
  }  

 

  const stopRecording = async () => {
    setDisabled(false)
    setIsRecording(false)
    console.log("recstopped")
    console.log(fulltranscript)

   // if (recognitionRef.current) {
      // recognitionRef.current.stop();
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
       //   console.log('botMessage:', botMessage)
          if (totalTranscript != "" && message != "") {
            chatHistory.push({ role: "Human", content: totalTranscript });
            chatHistory.push({ role: "AI", content: message });
          }
          console.log('chatHistory:', chatHistory)
         
          setBotMessage("");
        } catch (error) {
          console.error('Error fetching data:', error);
        } 
      }
      const fetchFeedback = async () => {
        try {
          console.log("sending",fulltranscript[0])
          const response = await fetch('/api/immediate_feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({"text":fulltranscript[0]}),
          });
          const fetchedData = await response.json();
          console.log("fetched data",fetchedData)
          feedback.push({content:fetchedData.feedback})
          console.log(feedback)
          setTranscript([]);
          //let feedback = fetchedData['response'];
          
         // console.log('message1:', message)
        //  console.log('totalTranscript2:', totalTranscript)
       //   console.log('botMessage:', botMessage)
          // if (totalTranscript != "" && message != "") {
          //   chatHistory.push({ role: "Human", content: totalTranscript });
          //   chatHistory.push({ role: "AI", content: message });
          // }
        //  console.log('chatHistory:', chatHistory)
          // setTranscript([]);
          // setBotMessage("");
        } catch (error) {
          console.error('Error fetching data:', error);
        } 
      }
         await fetchData();
         await fetchFeedback();

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
   // }
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
    <main className="  mb-7 h-screen w-screen bg-">
      <div className=" bg-white " >
     
        <ChatMessages chatHistory={chatHistory} feedback={feedback} />
        <div className="flex flex-col items-center w-full fixed bottom-0 pb-3">
          <button
            onClick={startRecording}
            disabled={disabled}
            className={`mt-10 m-auto flex items-center justify-center ${
              isRecording ? "bg-gray-600 hover:bg-gray-500" : "bg-blue-400 hover:bg-blue-500"
            } rounded-full w-20 h-20 focus:outline-none`}
          >
            {isRecording ?  (
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
                  style={{ width: `${progress}%`, transition: 'width 0.04s linear' }}
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
