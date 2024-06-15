import NavbarIn from "../components/navbarIn";
import HistoryTable from "../components/history2";
import StudentHome from "../components/studentHome";

import Footer from "../components/footer";
import { AuthContextProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { UserAuth } from "../context/AuthContext";
import { auth } from "../pages/api/firebase";
import React, { useState, useEffect } from "react";

const Home = () => {
  const queryClient = new QueryClient()
  const { user, googleSignIn, logOut } = UserAuth() || {};
  auth.onAuthStateChanged(function(user) {
    if (!user) {
      router.push('/login')
    }
  });
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

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
        console.log('data:', data);
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
    <>
      <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
      <NavbarIn />
      { role === "teacher" ? <Dashboard /> : <StudentHome /> }
      <Footer />
      </QueryClientProvider>
      </AuthContextProvider>
    </>
  );
}

export default Home;