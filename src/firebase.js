// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM053HP25AkmGeAnuFYY-zGCaeDlqnNQY",
  authDomain: "notes-app-bezen.firebaseapp.com",
  projectId: "notes-app-bezen",
  storageBucket: "notes-app-bezen.appspot.com",
  messagingSenderId: "385676468961",
  appId: "1:385676468961:web:df14e138c387f286710da0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);