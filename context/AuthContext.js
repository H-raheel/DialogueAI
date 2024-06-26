

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../pages/api/firebase";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  console.log("whyyourun")
  const [user, setUser] = useState(null);
  const [role,setRole]=useState(null);
  useEffect(() => {
     console.log("Updated user:", user);
    console.log("Updated role:", role);
  }, [ role,user]);
    const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const currentUser = result.user;
      setUser(currentUser);
   fetchUserRole(currentUser);
    });
  };

  const logOut =  () => {
    signOut(auth).then(() => {
      setUser(null);
      setRole(null);
    });
  };


  const fetchUserRole = async (user) => {
    if (user) {
      console.log("heee")
      console.log(user)
      try {
        const response = await fetch('/api/get_role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });
        const data =await response.json();
        console.log("data",data)
        setRole(data.role);
        
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    } else {
      setRole(null);
    }
  };

// const setFirebaseUser=(authUser)=>{
// setUser(authUser)
// }


  const setUserAndRole = async (authUser) => {
   
    setUser(authUser);
    await fetchUserRole(authUser)
    console.log("from context")
    
  };



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
   //   fetchUserRole(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut ,setUserAndRole}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};