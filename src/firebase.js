// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);


export const auth = getAuth();

export default getFirestore(app);


