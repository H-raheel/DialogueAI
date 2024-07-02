import React, { useEffect, useState } from "react";
// components

import CardStats from "../Cards/CardStats.js";

export default function HeaderStats({chatid}) {

  const [data, setData] = useState({
    assignment_name: "",
    due_date: "",
    is_submitted: false,
    total_errors: 0,
    name:""
});
  const [loading, setLoading] = useState(true);
  
  const formatDate = (dateStr) => {
    try {
      // Parse the input date string
      const dateObj = new Date(dateStr);
      
      // Format the date as required
      const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date Format';
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get_feedback_header_statistics_for_teacher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ chat_id: chatid }),
        });
       
        const fetchedData = await response.json();
        setData(fetchedData);
        console.log(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chatid]);

   
  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex">
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <CardStats
                  statSubtitle="Student Name"
                  statTitle={loading ? <Loader /> :data.name}
                  statArrow=""
                  statPercent=""
                 // statPercentColor="text-purple-500"
                  statDescripiron=""
                  statIconName="fas fa-person"
                  statIconColor="bg-purple-500"
                />
                </div>

              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">

                <CardStats
                  statSubtitle="Asssignment Name"
                  statTitle={loading ? <Loader /> :data.assignment_name}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="far fa-user"
                  statIconColor="bg-blue-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Total Mistakes"
                  statTitle={loading ? <Loader /> :data.total_errors}
                  statArrow=""
                  statPercent=""
                  statPercentColor=""
                  statDescripiron=""
                  statIconName="fas fa-folder"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
               
                <CardStats
                  statSubtitle="Submitted"
                  statTitle={loading ? <Loader /> :data.is_submitted?"Yes":"No"}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="fas fa-check"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="font-light w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Due Date"
                  statTitle={loading ? <Loader /> :formatDate(data.due_date)}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="fas fa-circle"
                  statIconColor="bg-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Loader = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
);