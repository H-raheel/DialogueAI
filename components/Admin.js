import React from "react";

// components

import TeacherNavbar from "./Navbars/TeacherNavbar.js";
import StudentNavbar from "./Navbars/StudentNavbar.js";
import StudentSidebar from "./Sidebar/SidebarStudent.js";
import TeacherSidebar from "./Sidebar/SidebarTeacher.js";
import HeaderStats from "./Headers/HeaderStats.js";
import FooterAdmin from "./Footers/FooterAdmin.js";

export default function Admin({ mode, children }) {
  return (
    <>
      {mode==="student" ? 
        <StudentSidebar /> : <TeacherSidebar />
      }
      <div className="relative md:ml-64 bg-blueGray-100">
        {mode==="student" ? 
          <StudentNavbar /> : <TeacherNavbar />
        }
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
