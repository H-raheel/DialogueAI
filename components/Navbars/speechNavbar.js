import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext.js";
export default function SpeechNavbar({chatid}) {
  const { user, googleSignIn, logOut } = UserAuth() || {};
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  var data;
  const router=useRouter()
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!user) {
  //       setLoading(true);
  //       return;
  //     }
  //     setLoading(true);
  //     const uid = user.uid;
  //     console.log('running')
  //     try {
  //       const response = await fetch('/api/getAssignments', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //         body: JSON.stringify({ uid }),
  //       });
  //       const fetchedData = await response.json();
  //       data = fetchedData['result'];

  //       setAssignments(data);
  //       console.log('data:', data)
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData(); // Call fetchData when the component mounts
  // }, [user]);

  const submitAssignment = async () => {
    // if (!user) {
    //   setLoading(true);
    //   return;
    // }
    // setLoading(true);

    console.log('running')
    try {
      const response = await fetch('/api/assignment_submitted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({"chat_id":chatid}),
      });
      const fetchedData = await response.json();
     

    console.log(fetchedData)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      router.push('/student/assignments')
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 left-0 w-full z-50 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          <p
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
          >
           
          </p>
          {/* Form */}
          <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
            <Link href="/student/assignments">
            <button
              className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-s px-8 py-4 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
            >
              Back
            </button>
          </Link>
         
            <button
              className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-s px-8 py-4 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              onClick={submitAssignment}
            >
       Submit
            </button>
      
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
