import "@fortawesome/fontawesome-free/css/all.min.css";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import 'regenerator-runtime/runtime';
import { store } from 'store';

import "../styles/tailwind.css";


function MyApp({ Component, pageProps }) {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
