import React from "react";

// components
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import Assignment from "../../components/assignment.js";
import withRoleProtection from "../../hoc/authWrap.jsx";
function AssignPage() {

    return (
      <div className="bg-black">
        {/* <AuthContextProvider> */}
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
          <Assignment />
        </div>
        {/* </AuthContextProvider> */}
      </div>
    );
  }


  export default withRoleProtection(AssignPage,["teacher"]);




  