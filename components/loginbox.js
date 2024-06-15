import Link from "next/link";
import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Loginbox = () => {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignIn = async (event) => {
    event.preventDefault(event);
    try {
      event.preventDefault()
      await googleSignIn();
    }
    catch (error) {
      console.log(error);
      alert(error);
    }
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const emailSubmit = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Success. The user has logged in")
        alert("Success. You are now logged in.")
      })
      .catch((error) => {
        alert(error.message);
    });
  };
  
    return (
      <>
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
          <div className="w-full p-6 bg-white dark:bg-black rounded-md shadow-lg lg:max-w-xl">
            <div className="mt-6">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-black-800 dark:text-sky-50"
                >
                  Email
                </label>
                <input
                  type="email"
                  onChange={(event) => setEmail(event.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-black-700 dark:text-sky-50 bg-white dark:bg-black border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-black-800 dark:text-sky-50"
                >
                  Password
                </label>
                <input
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-black-700 dark:text-sky-50 bg-white dark:bg-black border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mt-2">
                <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                onClick={emailSubmit}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
export default Loginbox;