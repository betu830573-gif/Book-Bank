/**
 * Firebase Config Configuration for Campus BookBank
 * 
 * To sync data across multiple devices (laptops/phones), configure a free Firebase project:
 * 1. Go to https://firebase.google.com and sign in with any Google Account.
 * 2. Click "Go to console" and then click "Add project". Name it e.g. "Campus BookBank".
 * 3. Once created, click the web icon (</>) to register a web app.
 * 4. Copy the config object (apiKey, authDomain, projectId, etc.) and paste it below.
 * 5. In the Firebase Console, go to "Firestore Database" and click "Create Database".
 * 6. Start it in "test mode" (so anyone can read/write during development/demo).
 * 
 * If you leave it as is, the project will automatically fall back to browser localStorage.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmpWiPU4RYNJD2XDrc7cZoP7P2yJAfIIc",
  authDomain: "book-bank-900cc.firebaseapp.com",
  projectId: "book-bank-900cc",
  storageBucket: "book-bank-900cc.firebasestorage.app",
  messagingSenderId: "661033796741",
  appId: "1:661033796741:web:a893c4097f1abfe31e55ec",
  measurementId: "G-01WNM75B9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
