import { ThemeProvider } from "next-themes";
import "../styles/tailwind.css";
import PageChange from "components/PageChange/PageChange.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'regenerator-runtime/runtime'

import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
