import React from "react";

// components

import CardLineChart from "../components/Cards/CardLineChart.js";
import CardBarChart from "../components/Cards/CardBarChart.js";
import CardPageVisits from "../components/Cards/CardPageVisits.js";
import CardSocialTraffic from "../components/Cards/CardSocialTraffic.js";
import ChatMessages from "./chatMessages.js";
import { UserAuth } from "../context/AuthContext.js";
import { useState, Fragment, useEffect } from "react";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const { user } = UserAuth();
    const [chat, setChat] = useState([]);

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
                const response = await fetch("/api/getChat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ "uid": uid }),
                });
                const fetchedData = await response.json();
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
        <div className="flex flex-wrap">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <CardLineChart />
          </div>
          <div className="w-full xl:w-4/12 px-4">
            <CardBarChart />
          </div>
        </div>
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <CardPageVisits />
          </div>
          <div className="w-full xl:w-4/12 px-4">
            <CardSocialTraffic />
          </div>
        </div>
      </>
    );
  }