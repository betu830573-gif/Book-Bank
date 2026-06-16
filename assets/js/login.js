import { auth } from "../../firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      // ADMIN EMAIL
      if (email === "admin@gmail.com") {

        window.location.href = "../../dashboard-admin.html";

      } else {

        window.location.href = "../../dashboard-student.html";

      }

    })
    .catch((error) => {

      console.log(error);
      alert(error.message);

    });

});
