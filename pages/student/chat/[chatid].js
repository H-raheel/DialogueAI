"use client";

import { useRouter } from 'next/router';
import { useState } from "react";
import SpeechNavbar from "../../../components/Navbars/speechNavbar.js";
import MicrophoneComponent from '../../../components/record.js';
import withRoleProtection from '../../../hoc/authWrap.jsx';

 function Test() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const chatid = router.query.chatid;

  return (
    <>
    
      {/* <Sidebar /> */}
      <div className="bg-black-100">
        <SpeechNavbar />
        <MicrophoneComponent chatid={chatid} />
      </div>
    
    </>
  );
}

export default withRoleProtection(Test, ['student'])