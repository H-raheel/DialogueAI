import React from "react";

// components

import CardBarChart from "../components/Cards/CardBarChart.js";


export default function StudentDashboard() {
    return (
      <>
        <div className="flex flex-wrap">
          {/* <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 ">
            <CardLineChart />
          </div> */}
          <div className="z-40  w-full xl:w-12/12 px-4">
            <CardBarChart  />
          </div>
        </div>
        {/* <div className="flex flex-wrap mt-4">
          <div className="flex-1 w-full xl:w-8/12 mb-12 xl:mb-0 px-4 ">
            <CardPageVisits />
          </div>
          <div className="flex-grow w-full xl:w-4/12 px-4">
            <CardSocialTraffic />
          </div>
        </div> */}
      </>
    );
  }