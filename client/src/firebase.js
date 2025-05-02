// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIrx52SrdYgFOtRJWVnnnTDagQUTgnFq8",
  authDomain: "academic-progress-tracker.firebaseapp.com",
  projectId: "academic-progress-tracker",
  storageBucket: "academic-progress-tracker.firebasestorage.app",
  messagingSenderId: "982433393282",
  appId: "1:982433393282:web:89e72d52702f95c3dbe29b",
  measurementId: "G-PX3GCVYBTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);