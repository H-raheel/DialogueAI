import React from "react";



import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import HeaderStats from "../../components/Headers/FeedbackHeaderStats.js";
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import Dashboard from "../../components/feedbackDashboard.js";
import withRoleProtection from "../../hoc/authWrap.jsx";

// const props={
//     student:"stdname",
//   assignment:"Assignment 1",
//   classsection:"2A",
//   submitted:"Yes"
//   ,duedate:"12 August"

// }
function feedbackDashboard() {
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

export default withRoleProtection(feedbackDashboard,['teacher'])


