import React from "react";

// components
import Dashboard from "../../components/dashboard.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import Header from "../../components/Headers/assignmentHeader.js";
import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import { AuthContextProvider } from "../../context/AuthContext.js";
import CardTable from "../../components/Cards/CardTableS.js";

export default function StudentDashboard() {
  return (
    <>
    <AuthContextProvider>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <Header />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <CardTable role="student" color="dark" />
          <FooterAdmin />
        </div>
      </div>
    </AuthContextProvider>
    </>
  );
}
