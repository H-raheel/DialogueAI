import React from "react";

// components
import Assignment from "../../components/assignment.js";
import AdminNavbar from "../../components/Navbars/TeacherNavbar.js";
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import HeaderStats from "../../components/Headers/HeaderStats.js";
import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import { AuthContextProvider } from "../../context/AuthContext.js";

export default function AssignPage() {

    return (
      <>
        <AuthContextProvider>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
          <Assignment />
        </div>
        </AuthContextProvider>
      </>
    );
  }
