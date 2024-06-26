import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext.js";
export default function SpeechNavbar() {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  var data;
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(true);
        return;
      }
      setLoading(true);
      const uid = user.uid;
      console.log('running')
      try {
        const response = await fetch('/api/getAssignments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ uid }),
        });
        const fetchedData = await response.json();
        data = fetchedData['result'];

        setAssignments(data);
        console.log('data:', data)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [user]);
  console.log('data:', data);
  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 left-0 w-full z-50 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          <p
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
          >
           Assignment Name here
          </p>
          {/* Form */}
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
            <Link href="/student/assignments">
            <button
              className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
            >
              Back
            </button>
          </Link>
            </div>
            {/* <select name="class" id="class">
              <option disabled>Choose an assignment</option>
              {((assignments && assignments.length === 0) || !assignments) ? (
                <option disabled selected>No assignments available</option>
              ) : (
                assignments.map((assignment) => (
                  <option value={assignment.class}>{assignment.name}</option>
                ))
              )}
            </select> */}
          </form>
          {/* User */}
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
