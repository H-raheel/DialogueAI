import React from "react";

// components
import FooterAdmin from "../../components/Footers/FooterAdmin.js";
import Header from "../../components/Headers/assignmentHeader.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import CardTable from "../../components/Tables/AssignmentTable.js";
import { AuthContextProvider } from "../../context/AuthContext.js";
import withRoleProtection from "../../hoc/authWrap.jsx";



function Assignments() {
  return (
    <>
    <AuthContextProvider>
      <Sidebar />
      <div className="relative md:ml-64 bg-white-100">
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

export default withRoleProtection(Assignments,['student'])