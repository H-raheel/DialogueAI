import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from 'next/router';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../pages/api/firebase";
import { addUser } from "../store/reducers/authSlice";

const Loginbox = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      await fetchUserRole(currentUser);
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again.');
    }
  };

  const fetchUserRole = async (user) => {
    if (user) {
      try {
        const response = await fetch('/api/get_role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });
        const data = await response.json();
        const { role, language } = data;
        console.log("User role:", role);
        dispatch(addUser({ user: user.uid, role, language }));
        if (role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (role === 'student') {
          router.push('/student/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        alert('Failed to fetch user role. Please try again.');
      }
    }
  };

  const handleSignIn = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const authUser = result.user;
      await fetchUserRole(authUser);
      alert("Success. You are now logged in.");
      // Routing based on role handled in fetchUserRole function
    } catch (error) {
      console.error('Email/password sign-in error:', error);
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
              onClick={handleSignIn}
            >
              Login
            </button>
            {/* <button
              className="w-full mt-2 px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={googleSignIn}
            >
              Sign in with Google
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginbox;
