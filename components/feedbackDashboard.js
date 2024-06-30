import React, { useEffect, useState } from "react";

// components

import { useSelector } from "react-redux";
import CardGeneralFeedback from "./Cards/Cardfeedback1.js";
import CardBarChart from "./Cards/FeedbackBarChart.js";
import ChatMessages from "./chatMessages";
export default function Dashboard({chatid}) {
 
  const role=useSelector((state) => state.role);
  //set chathistory
  const [chatHistory,setChatHistory]=useState([])
  //set immfeedback


  const [feedback,setFeedback]=useState([])

  //general feedback

  const [generalFeedback,setGeneralFeedback]=useState({})
  const [loading,setLoading]=useState(false);


  const dummyData = {
    grammatical: "Messages are grammatically correct",
    tone: "Your tone is casual and friendly",
    vocabulary: "Appropriate vocabulary for the conversation",
  }; 
  useEffect(() => {
    // setGeneralFeedback(dummyData);
    //gets the stored chat
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
      //  setGeneralFeedback(dummyData);
        console.log('chatHistory1:', messages)
       // console.log(generalFeedback)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
     
    };
    const fetchData2=async()=>{
      try {
        console.log("inside")
        const response = await fetch('/api/getAssignmentFeedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ "chatid": chatid }),
        });
        const fetchedData = await response.json();
        var feedback = fetchedData['feedback'];
       // setChatHistory(messages);
        setGeneralFeedback(feedback);
       // console.log('chatHistory1:', messages)
        console.log(generalFeedback)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    //api/getAssignmentFeedback
  fetchData2()
  fetchData();
     // Call fetchData when the component mounts
  }, [chatid]);
console.log(generalFeedback)

    return (
      <>
   <div className="flex flex-row ">
  <div className="xl:w-8/12 mx-7 mb-12">
    <CardBarChart chatid={chatid} />
  </div>
  <div className="xl:w-4/12 h-64 px-4 flex flex-col">
    <div className="flex-grow">
      <CardGeneralFeedback data ={generalFeedback}/>
    </div>
  </div>
</div>

      <div className="flex mt-4 ">
       
        
       
        <div className=" xl:w-screen" >
          <ChatMessages chatHistory={chatHistory} feedback={[]}/>
          </div>
        {/* <div className=" px-4 xl:w-8/12 flex-grow">
          <CardMistakes />
        </div> */}
      </div>
    </>
    );
  }