import React from "react";

// components
import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import HeaderStats from "../../components/Headers/HeaderStats.js";
import Navbar from "../../components/Navbars/StudentNavbar.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import StudentDashboard from "../../components/stddashboard.js";
import { AuthContextProvider } from "../../context/AuthContext.js";

export default function Dashboard() {
  return (
    <>
    <AuthContextProvider>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <Navbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <StudentDashboard />
          <FooterAdmin />
        </div>
      </div>
    </AuthContextProvider>
    </>
  );
}
