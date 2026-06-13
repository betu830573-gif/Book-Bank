import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Yeh raha aapka updated click event listener
document.getElementById("loginBtn").addEventListener("click", (e) => { 
    e.preventDefault(); // Page ko automatic refresh hone se rokega

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
          alert("Login Successful");
          window.location.href = "dashboard-student.html"; // Sahi dashboard ka path
      })
      .catch((error) => {
          alert(error.message); // Agar login fail hua to error alert dikhega
      });
});
