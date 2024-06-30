import React from "react";

// components
import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import HeaderStats from "../../components/Headers/HeaderStats.js";
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import Dashboard from "../../components/dashboard.js";
import withRoleProtection from "../../hoc/authWrap.jsx";


 function TeacherDashboard() {
  return (
    <>
   
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* <AdminNavbar /> */}
        
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Dashboard />
          {/* <FooterAdmin /> */}
        </div>
      </div>
    
    </>
  );
}

export default withRoleProtection(TeacherDashboard,['teacher'])