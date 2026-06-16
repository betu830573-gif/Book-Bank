// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase Config
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

// Export Auth
export const auth = getAuth(app);
