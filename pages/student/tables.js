import React from "react";

// components

import CardTable from "../../components/Cards/CardTableS.js";

// layout for page

import Admin from "../../components/Admin.js";

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable role="student" color="dark" />
        </div>
      </div>
    </>
  );
}

Tables.layout = Admin("student");
