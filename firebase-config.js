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

window.FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
