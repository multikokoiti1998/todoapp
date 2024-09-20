// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHl7WWt-LBvQnbp-owJj3vS8LbgET5878",
  authDomain: "mens-todos-8b5a4.firebaseapp.com",
  projectId: "mens-todos-8b5a4",
  storageBucket: "mens-todos-8b5a4.appspot.com",
  messagingSenderId: "528250001085",
  appId: "1:528250001085:web:a0abda5b754a19a04ac9d4",
  measurementId: "G-DQMQEYGG93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {db,auth,analytics};