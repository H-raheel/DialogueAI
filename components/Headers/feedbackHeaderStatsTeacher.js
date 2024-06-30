import React from "react";

// components

import CardStats from "../Cards/CardStats.js";

export default function HeaderStats({props}) {

   const {assignment,classsection,submitted,duedate,name}=props;

   
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
                  statTitle={name}
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
                  statTitle={assignment}
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
                  statSubtitle="Class"
                  statTitle={classsection}
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
                  statTitle={submitted}
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
                  statTitle={duedate}
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
