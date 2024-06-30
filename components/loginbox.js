import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from 'next/router';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../store/reducers/authSlice";

import { auth } from "../pages/api/firebase";
const Loginbox = () => {
 // const { user, role, googleSignIn, setUserAndRole } = UserAuth() || {};
 const dispatch=useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleSignIn =  () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const currentUser = result.user;
      const role=fetchUserRole(currentUser);
      dispatch(addUser({ user: currentUser, role: role }));
      console.log(role);
      if (role) {
        if (role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (role === 'student') {
          router.push('/student/dashboard');
        }
      }
   
    });
  };

  const  fetchUserRole = async (user) => {
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
        return data.role;
        console.log("data",data)
      //  setRole(data.role);
        
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    } else {
      alert(error)
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // useEffect(() => {
  //   console.log('inuseff')
  //   if (role) {
  //     if (role === 'teacher') {
  //       router.push('/teacher/dashboard');
  //     } else if (role === 'student') {
  //       router.push('/student/dashboard');
  //     }
  //   }
  // }, [role, router]);

  const emailSubmit = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const authUser = result.user;
      console.log(authUser)
      const role=await fetchUserRole(authUser);
      console.log("rollee")
      console.log(role);
      dispatch(addUser({ user: authUser.uid
        , role: role }));
      alert("Success. You are now logged in.");
      if (role) {
        console.log("pushingg")
            if (role === 'teacher') {
              router.push('/teacher/dashboard');
            } else if (role === 'student') {
              router.push('/student/dashboard');
            }
          }
      //await setUserAndRole(authUser); // Set user and role
    } catch (error) {
      console.log(error);
    
      alert(error.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white dark:bg-black rounded-md shadow-lg lg:max-w-xl">
        <div className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-black-800 dark:text-sky-50">
              Email
            </label>
            <input
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              className="block w-full px-4 py-2 mt-2 text-black-700 dark:text-sky-50 bg-white dark:bg-black border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-black-800 dark:text-sky-50">
              Password
            </label>
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              className="block w-full px-4 py-2 mt-2 text-black-700 dark:text-sky-50 bg-white dark:bg-black border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-2">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              onClick={emailSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginbox;
