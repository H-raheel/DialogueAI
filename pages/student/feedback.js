import React from "react";



import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import HeaderStats from "../../components/Headers/FeedbackHeaderStats.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import Dashboard from "../../components/feedbackDashboard.js";


const props={
  assignment:"Assignment 1",
  classsection:"2A",
  submitdate:"12August"
  ,duedate:"12 August"

}
 export default function feedbackDashboard() {
  return (
    <>
   
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* <Navbar /> */}
        {/* Header */}
      <HeaderStats props={props}/>
      <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Dashboard />
          <FooterAdmin />
        </div>
      </div>
   
    </>
  );
}


