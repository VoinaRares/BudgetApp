// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {GoogleAuthProvider, getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyC096FJUSFSxHQ_uiiVGs4dZ3c8A9IGy2E",
  authDomain: "budgetapp-9c022.firebaseapp.com",
  projectId: "budgetapp-9c022",
  storageBucket: "budgetapp-9c022.appspot.com",
  messagingSenderId: "61370728719",
  appId: "1:61370728719:web:d3b0101122d6ac30b13e7a",
  measurementId: "G-MDHWN983WD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
export const googleProvider = new GoogleAuthProvider();