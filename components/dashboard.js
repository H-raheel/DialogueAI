import React from "react";

// components

import CardLineChart from "../components/Cards/CardLineChart.js";
import CardPageVisits from "../components/Cards/CardPageVisits.js";
import CardBarChart from "./Cards/CardBarChart.js";
import CardStudentsPerformance from "./Cards/CardBestPerformers.js";
import CardSocialTraffic from "./Cards/CardSocialTraffic.js";
export default function Dashboard() {
    return (
      <>
        <div className="flex flex-wrap">
          <div className=  "  xl:w-8/12 mb-12  px-4">
            <CardLineChart />
          </div>
          <div className=" xl:w-4/12 px-4 h-64">
            <CardBarChart  role="teacher"/>
          </div>
        </div>
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4 h-64">
            <CardPageVisits />
          </div>
          
          <div className="w-full xl:w-6/12 px-4">
            <CardStudentsPerformance/>
          </div>
          <div className="w-full px-4">
            <CardSocialTraffic />
          </div>
        </div>
      </>
    );
  }