"use client";

import { useRouter } from 'next/router';
import { useState } from "react";
import SpeechNavbar from "../../../components/Navbars/speechNavbar.js";
import MicrophoneComponent from '../../../components/record.tsx';
import withRoleProtection from '../../../hoc/authWrap.jsx';



 function Test() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const chatid = router.query.chatid;

  return (
    <div className="grid grid-rows-8 h-screen overflow-hidden">
    
      {/* <Sidebar /> */}
      <div className="bg-black-100 " > <SpeechNavbar chatid={chatid} /></div>
       
        <div className="bg-yellow-400 row-span-7 flex flex-col items-start justify-start" >
          <MicrophoneComponent chatid={chatid} />
        
</div>        
        
      
    
    </div>
  );
}

export default withRoleProtection(Test, ['student'])