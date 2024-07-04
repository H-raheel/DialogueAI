import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardGeneralFeedback from "./Cards/Cardfeedback1.js";
import CardBarChart from "./Cards/FeedbackBarChart.js";
import ChatMessages from "./chatMessageFeedback.tsx";

export default function Dashboard({ chatid }) {
  const role = useSelector((state) => state.role);
  const [chatHistory, setChatHistory] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState({});

  // Function to filter AI responses
  function filterAIResponses(data) {
    return data.filter((item) => item.role === "AI");
  }

  useEffect(() => {
    // Fetch chat data
    const fetchData = async () => {
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
        const messages = fetchedData["chatHistory"];
        const feedbackData = filterAIResponses(fetchedData["feedback_history"]);
        setFeedback(feedbackData);
        setChatHistory(messages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch general feedback
    const fetchGeneralFeedback = async () => {
      try {
        const response = await fetch("/api/getAssignmentFeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ chatid: chatid }),
        });
        const fetchedData = await response.json();
        const feedback = fetchedData["feedback"];
        setGeneralFeedback(feedback);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGeneralFeedback();
    fetchData();
  }, [chatid]);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Bar Chart and General Feedback */}
      <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-grow md:w-8/12">
          <CardBarChart chatid={chatid} />
        </div>
        <div className=" md:w-4/12">
          <CardGeneralFeedback data={generalFeedback} />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="w-full">
        <ChatMessages chatHistory={chatHistory} feedback={feedback} />
      </div>
    </div>
  );
}
