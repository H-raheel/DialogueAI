import React, { useEffect, useState } from "react";

// components

import { useSelector } from "react-redux";
import CardBarChart from "./Cards/CardBarChart.js";
import CardMistakes from "./Cards/CardFeedback2.js";
import CardGreatWork from "./Cards/Cardfeedback1.js";
import ChatMessages from "./chatMessages";
export default function Dashboard() {
 
  const role=useSelector((state) => state.role);
  const [chatHistory,setChatHistory]=useState([])
  const [loading,setLoading]=useState(false);
  const chatid='6625d19e23b55556764d3198'
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
      <>
   <div className="flex flex-row">
  <div className="xl:w-8/12 mx-28 mb-12">
    <CardBarChart role />
  </div>
  <div className="xl:w-4/12 px-4 flex flex-col">
    <div className="flex-grow">
      <CardGreatWork />
    </div>
  </div>
</div>

      <div className="flex mt-4 ">
       
        
       
        <div className=" xl:w-4/12" >
          <ChatMessages chatHistory={chatHistory}/>
          </div>
        <div className=" px-4 xl:w-8/12 flex-grow">
          <CardMistakes />
        </div>
      </div>
    </>
    );
  }