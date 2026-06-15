import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential =
      await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful");
    console.log(userCredential.user);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
