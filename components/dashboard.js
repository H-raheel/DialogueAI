import React from "react";
import { useSelector } from "react-redux";
import CardBarChart from "./Cards/CardBarChart.js";
import CardStudentsPerformance from "./Cards/CardBestPerformers.js";

export default function Dashboard() {
  const role = useSelector((state) => state.role);

  return (
    <>
      <div className="flex flex-wrap">
        {/* CardBarChart Component */}
        <div className="w-full xl:w-10/12 mx-auto mb-12">
          <CardBarChart />
        </div>
      </div>

      {/* Centering the Students Performance Card */}
      <div className="flex justify-center mt-4">
        <div className="w-full xl:w-8/12">
          <CardStudentsPerformance />
        </div>
      </div>
    </>
  );
}
