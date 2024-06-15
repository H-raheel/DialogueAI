import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import firebase from "firebase/compat/app";
import {getFirestore} from 'firebase/firestore';
import {getAnalytics} from 'firebase/analytics';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP7TyTViCJt6EQchLQVlzZc_gzdcm0Qsw",
  authDomain: "dialogueai-b0f34.firebaseapp.com",
  projectId: "dialogueai-b0f34",
  storageBucket: "dialogueai-b0f34.appspot.com",
  messagingSenderId: "273593108613",
  appId: "1:273593108613:web:62e0532e49531062d581ec",
  measurementId: "G-0N4K0HEPS5"
};


// Initialize Firebase
/*
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}
*/

let analytics; let firestore; let app;
if (firebaseConfig?.projectId) {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  if (app.name && typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

  // Access Firebase services using shorthand notation
  firestore = getFirestore();
}
/*
if (app.name && typeof window !== 'undefined') {
  export const analytics = firebase.analytics();
}
*/
//export const analytics = firebase.analytics()
export {firestore, analytics}
export const auth = getAuth(app)
export const fbStorage = getStorage(app)
export const FFieldValue = firestore.FieldValue;