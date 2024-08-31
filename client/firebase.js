import { initializeApp } from "firebase/app";
import {  GoogleAuthProvider } from "firebase/auth";

 
const firebaseConfig = {
  apiKey: "AIzaSyBtXo4BB9mnizKZ2dTNAmkyv1IJqNJYfng",
  authDomain: "blogging-website-7c1c9.firebaseapp.com",
  projectId: "blogging-website-7c1c9",
  storageBucket: "blogging-website-7c1c9.appspot.com",
  messagingSenderId: "861176120935",
  appId: "1:861176120935:web:c08436a7cb9d2fa0b176c2",
  measurementId: "G-W1PW0MDNPT"
};

const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();

export default app;