import React from "react";

// components

import { useSelector } from "react-redux";
import CardBarChart from "./Cards/CardBarChart.js";
import CardStudentsPerformance from "./Cards/CardBestPerformers.js";
import CardSocialTraffic from "./Cards/CardSocialTraffic.js";

export default function Dashboard() {

  const role=useSelector((state) => state.role);
    return (
      <>
        <div className="flex flex-wrap">
          {/* <div className=  "  xl:w-8/12 mb-12  px-4">
            <CardLineChart />
          </div> */}
          <div className="  items-center xl:w-10/12 mx-28 mb-12 ">
            <CardBarChart />
          </div>
        </div>
        <div className="flex mt-4 ">
          {/* <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4 h-64">
            <CardPageVisits />
          </div> */}
          
          <div className=" xl:w-4/12 px-4">
            <CardStudentsPerformance/>
          </div>
          <div className=" px-4 xl:w-8/12">
            <CardSocialTraffic />
          </div>
        </div>
      </>
    );
  }