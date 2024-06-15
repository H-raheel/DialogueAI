import React from "react";

// components
import Dashboard from "../../components/dashboard.js";
import AdminNavbar from "../../components/Navbars/TeacherNavbar.js";
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import HeaderStats from "../../components/Headers/HeaderStats.js";
import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import { AuthContextProvider } from "../../context/AuthContext";

export default function Admin() {
  return (
    <>
    <AuthContextProvider>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Dashboard />
          <FooterAdmin />
        </div>
      </div>
    </AuthContextProvider>
    </>
  );
}
