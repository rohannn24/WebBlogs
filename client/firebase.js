// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtXo4BB9mnizKZ2dTNAmkyv1IJqNJYfng",
  authDomain: "blogging-website-7c1c9.firebaseapp.com",
  projectId: "blogging-website-7c1c9",
  storageBucket: "blogging-website-7c1c9.appspot.com",
  messagingSenderId: "861176120935",
  appId: "1:861176120935:web:c08436a7cb9d2fa0b176c2",
  measurementId: "G-W1PW0MDNPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();

export default app;