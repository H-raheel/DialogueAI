import React from "react";

// components

import CardTable from "../../components/Cards/CardTableT.js";

// layout for page
import Admin from "../../components/Admin.js";
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import withRoleProtection from "../../hoc/authWrap.jsx";
 function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
      <Sidebar/>
        <div className="w-full ml-72 mb-12 px-4">
      
          <CardTable  color="dark" />
        </div>
      </div>
    </>
  );
}

Tables.layout = Admin("teacher");
export default withRoleProtection(Tables, ['teacher']);