"use client";

import { useState, Fragment } from "react";
import { AuthContextProvider } from "../../context/AuthContext.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import Footer from "../../components/Footers/FooterAdmin.js";
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import Dashboard from "../../components/dashboard.js";
import AdminNavbar from "../../components/Navbars/StudentNavbar.js";
import Header from "../../components/Headers/DetailHeader.js";
import FooterAdmin from "../../components/Footers/FooterAdmin.js";

export default function Test() {
  const router = useRouter();
  const chatid = router.query.chatid;

  return (
    <>
      <AuthContextProvider>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
          <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
            <p
              className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            >
              Assignment Details
            </p>
          </div>
        </nav>
        {/* Header */}
        <Header chatid={chatid} />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Dashboard /> 
          <FooterAdmin />
        </div>
      </div>
      </AuthContextProvider>
    </>
  );
}