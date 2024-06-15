"use client";

import MicrophoneComponent from '../../components/record';
import SpeechNavbar from "../../components/Navbars/speechNavbar.js";
import { useState, Fragment } from "react";
import { AuthContextProvider } from "../../context/AuthContext.js";
import Sidebar from "../../components/Sidebar/SidebarStudent.js";
import Footer from "../../components/Footers/FooterAdmin.js";
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { UserAuth } from "../../context/AuthContext.js";
import auth from '../api/firebase.js';

export default function Test() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const chatid = router.query.chatid;

  return (
    <>
      <AuthContextProvider>
      <Sidebar />
      <div className="relative md:ml-64 bg-black-100">
        <SpeechNavbar />
        <MicrophoneComponent chatid={chatid} />
      </div>
      </AuthContextProvider>
    </>
  );
}