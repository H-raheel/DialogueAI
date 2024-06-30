import React from "react";

// components

import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import HeaderStats from "../../components/Headers/HeaderStatsS.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import StudentDashboard from "../../components/stddashboard.js";
import withRoleProtection from "../../hoc/authWrap.jsx";

const props={
 language: "German",
 pending:2,
 nextdue:"12 August",
 totalsubmitted:3

}
 function Dashboard() {
  return (
    <>
   
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* <Navbar /> */}
        {/* Header */}
      <HeaderStats props={props}/>
      <div className="px-4 md:px-10 mx-auto h-screen w-full -m-24">
          <StudentDashboard />
          {/* <FooterAdmin /> */}
        </div>
      </div>
   
    </>
  );
}

export default withRoleProtection(Dashboard,['student'])
