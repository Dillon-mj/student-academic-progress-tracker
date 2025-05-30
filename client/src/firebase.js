// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";  // <-- Use Realtime Database here
// Removed Firestore import since you are not using it currently

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIrx52SrdYgFOtRJWVnnnTDagQUTgnFq8",
  authDomain: "academic-progress-tracker.firebaseapp.com",
  databaseURL: "https://academic-progress-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/",  // Note: matches your Realtime DB URL
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
export const db = getDatabase(app);  // <-- Export Realtime Database instance here
