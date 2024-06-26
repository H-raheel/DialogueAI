import React from "react";

// components

import CardSettings from "../../components/Cards/CardSettings.js";

// layout for page
import Admin from "layouts/Admin.js";
import Sidebar from "../../components/Sidebar/SidebarTeacher.js";
import withRoleProtection from "../../hoc/authWrap.jsx";
 function Settings() {
  return (
    <>
      <div className="flex flex-wrap">
        <Sidebar/>
        <div className="w-full mt-10 ml-72 lg:w-8/12 px-4">
          <CardSettings argument={"teacher"}/>
        </div>
        {/* <div className="w-full lg:w-4/12 px-4">
          <CardProfile />
        </div> */}
      </div>
    </>
  );
}

Settings.layout = Admin("teacher");
export default withRoleProtection(Settings, ['teacher']);