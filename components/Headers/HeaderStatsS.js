import React from "react";

// components

import CardStats from "../Cards/CardStats.js";

export default function HeaderStats({props}) {

   const {language,pending,nextdue,totalsubmitted}=props;

   
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
                  statSubtitle="Language"
                  statTitle={language}
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
                  statSubtitle="Next Due Date"
                  statTitle={nextdue}
                  statArrow=""
                  statPercent=""
                  statPercentColor=""
                  statDescripiron=""
                  statIconName="fas fa-folder"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                {/* <CardStats
                  statSubtitle="SALES"
                  statTitle="924"
                  statArrow="down"
                  statPercent="1.10"
                  statPercentColor="text-orange-500"
                  statDescripiron="Since yesterday"
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                /> */}
                <CardStats
                  statSubtitle="Pending Assignments"
                  statTitle={pending}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="fas fa-frown"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="font-light w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Total Submitted"
                  statTitle={totalsubmitted}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="fas fa-smile-beam"
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
