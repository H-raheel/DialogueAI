import React from "react";

// components
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import Assignment from "../../components/assignment.js";
import withRoleProtection from "../../hoc/authWrap.jsx";
function AssignPage() {

    return (
      <>
        {/* <AuthContextProvider> */}
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
          <Assignment />
        </div>
        {/* </AuthContextProvider> */}
      </>
    );
  }


  export default withRoleProtection(AssignPage,["teacher"])