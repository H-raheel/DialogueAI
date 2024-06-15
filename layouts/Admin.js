import React from "react";

// components

import TeacherNavbar from "components/Navbars/TeacherNavbar.js";
import StudentNavbar from "components/Navbars/StudentNavbar.js";
import StudentSidebar from "components/Sidebar/SidebarStudent.js";
import TeacherSidebar from "components/Sidebar/SidebarTeacher.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

export default function Admin({ mode, children }) {
  if (!mode) {
    mode = "student";
  }
  return (
    <>
      {mode==="student" ? 
        <StudentSidebar /> : <TeacherSidebar />
      }
      <div className="relative md:ml-64 bg-blueGray-100">
      ` {mode==="student" ? 
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
