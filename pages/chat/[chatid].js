"use client";

import { useRouter } from 'next/router';
import { useState } from "react";
import SpeechNavbar from "../../components/Navbars/speechNavbar.js";
import MicrophoneComponent from '../../components/record';
import { AuthContextProvider } from "../../context/AuthContext.js";

export default function Test() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const chatid = router.query.chatid;

  return (
    <>
      <AuthContextProvider>
      {/* <Sidebar /> */}
      <div className="bg-black-100">
        <SpeechNavbar />
        <MicrophoneComponent chatid={chatid} />
      </div>
      </AuthContextProvider>
    </>
  );
}