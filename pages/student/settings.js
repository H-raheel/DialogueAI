import React from "react";

// components

import CardProfile from "../../components/Cards/CardProfile.js";
import CardSettings from "../../components/Cards/CardSettings.js";
import withRoleProtection from "../../hoc/authWrap.jsx";
// layout for page

//import Admin from "layouts/Admin.js";

 function Settings() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardSettings argument={"student"}/>
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <CardProfile />
        </div>
      </div>
    </>
  );
}

//Settings.layout = Admin("student");

export default withRoleProtection(Settings, ['student'])
