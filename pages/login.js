'use client'
import Link from "next/link";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Loginbox from "../components/loginbox";

import { collection, getDocs } from "firebase/firestore";
import { AuthContextProvider } from "../context/AuthContext";

const Login = () => {
  return (
    <>
    <AuthContextProvider>
      <Navbar />
      <Loginbox />
      <Footer />
    </AuthContextProvider>
    </>
  );
}
export default Login;