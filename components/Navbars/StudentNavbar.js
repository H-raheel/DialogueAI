import { UserAuth } from "../../context/AuthContext.js";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(true);
  /*
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
  */
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <p
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
          >
            Teacher Metrics Page
          </p>
          {/* Form */}
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">

            </div>
            <select name="class" id="class">
              <option disabled>Choose a class</option>
              <option value="saab">1A</option>
              <option value="opel">2B</option>
              <option value="audi">3C</option>
            </select>
          </form>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
