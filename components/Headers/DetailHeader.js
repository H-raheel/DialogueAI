import React from "react";

// components
import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext.js";
import CardStats from "../Cards/CardPlain.js";

export default function HeaderStats({chatid}) {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(true);
  const [ assignment, setAssignment ] = useState([]);
  const [ chat, setChat ] = useState([]);
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    const fetchData = async () => {
      if (!user) {
        return;
      }
      const uid = user.uid;
      try {
        const response = await fetch("/api/getAssignmentDetail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ "chatid":chatid }),
        });
        const fetchedData = await response.json();
        setAssignment(fetchedData["assignment"]);
        setChat(fetchedData["chat"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    checkAuthentication();
    fetchData();
  }, [user]);
  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Assignment"
                  statTitle={assignment.name}
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Description"
                  statTitle={assignment.description}
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Deadline"
                  statTitle={assignment.due_date}
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Language"
                  statTitle={assignment.language}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
