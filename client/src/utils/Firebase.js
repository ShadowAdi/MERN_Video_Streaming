import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider}  from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.VITE_SECRET,
  authDomain: "video-sharing-e1749.firebaseapp.com",
  projectId: "video-sharing-e1749",
  storageBucket: "video-sharing-e1749.appspot.com",
  messagingSenderId: "893553981338",
  appId: "1:893553981338:web:a56745cadd24c5dc612c23",
  measurementId: "G-GPJPCQP70X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const provider=new GoogleAuthProvider()


export default app
