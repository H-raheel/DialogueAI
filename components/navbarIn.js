import Link from "next/link";
import { useRouter } from 'next/router';
import ThemeChanger from "./DarkSwitch";
import Image from "next/image"
import { Disclosure } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { UserAuth } from "../context/AuthContext";
import { auth } from "../pages/api/firebase";

const NavbarIn = async () => {
  const navigation = [
    "Home",
    "Predict"
  ]; 
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const handleSignOut = async (event) => {
    try {
        event.preventDefault();
        await logOut();
        router.push("/login");
    }
    catch (error) {
        console.log(error);
    }
  }
  auth.onAuthStateChanged(function(user) {
    if (!user) {
      router.push('/login')
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(true);
        return;
      }
      setLoading(true);
      const uid = user.uid;
      try {
        const response = await fetch('/api/get_role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ uid }),
        });
        const fetchedData = await response.json();
        var data = fetchedData['role'];
        setRole(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [user]);

  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                <Link href="/">
                  <span className="flex items-center space-x-2 text-2xl font-medium text-black-500 dark:text-gray-100">
                    <span>
                      <Image
                        src={theme==='dark' ? "/img/logo.png" : "/img/logo2.png"}
                        alt="N"
                        width="32"
                        height="32"
                        className="w-8"
                      />
                    </span>
                    <span>DialogueAI</span>
                  </span>
                </Link>

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700">
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>
                
                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <>
                    <Link key="Home" href="/home" className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none"></Link>
                    <Link key="Predict" href="/predict" className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none"></Link>
                    <Link href="/" className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">         
                        Log Out
                    </Link>
                  </>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>

        {/* menu  */}
        { loading ? <p>Loading...</p> : (role === "teacher" ?
          <div className="hidden text-center lg:flex lg:items-center">
            <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
              <Link href="/home" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                Home
              </Link> 
              <Link href="/assign" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                Assignments
              </Link>
            </ul>
          </div> :
          <div className="hidden text-center lg:flex lg:items-center">
            <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
              <Link href="/home" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                Home
              </Link> 
              <Link href="/assignments" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                Assignments
              </Link>
            </ul>
          </div>
        )}

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
            <Link href="/" className="px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5"
            onClick={handleSignOut}>
                Log Out
            </Link>
          <ThemeChanger />
        </div>
      </nav>
    </div>
  );
}

export default NavbarIn;
