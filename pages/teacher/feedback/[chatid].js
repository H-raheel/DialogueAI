import { useRouter } from "next/router.js";
import React from "react";



import HeaderStats from "../../../components/Headers/feedbackHeaderStatsTeacher.js";
import Sidebar from "../../../components/Sidebar/SidebarTeacher.js";
import Dashboard from "../../../components/feedbackDashboard.js";
const props={
  assignment:"Assignment 1",
  name:"StudentName",
  classsection:"2A",
  submitted:"Yes"
  ,duedate:"12 August"

}
 export default function feedbackDashboard() {

    const router = useRouter();
    const { chatid } = router.query;
  return (
    <>
   
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* <Navbar /> */}
        {/* Header */}
      <HeaderStats props={props}/>
      <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Dashboard  chatid={chatid}/>
          {/* <FooterAdmin /> */}
        </div>
      </div>
   
    </>
  );
}


