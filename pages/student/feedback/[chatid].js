import { useRouter } from "next/router.js";
import React from "react";



import HeaderStats from "../../../components/Headers/FeedbackHeaderStats.js";
import Sidebar from "../../../components/Sidebar/SidebarStudent.js";
import Dashboard from "../../../components/feedbackDashboard.js";
import withRoleProtection from "../../../hoc/authWrap.jsx";
const props={
  assignment:"Assignment 1",
  classsection:"2A",
  submitted:"Yes"
  ,duedate:"12 August"

}
 function feedbackDashboard() {

    const router = useRouter();
    const chatid = router.query.chatid;
    console.log(chatid)
  return (
    <>
   
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* <Navbar /> */}
        {/* Header */}
      <HeaderStats chatid={chatid}/>
      <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Dashboard  chatid={chatid}/>
          {/* <FooterAdmin /> */}
        </div>
      </div>
   
    </>
  );
}

export default withRoleProtection(feedbackDashboard,['student'])



