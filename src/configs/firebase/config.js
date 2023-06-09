import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCBjBfFz7WNMkSZhFRx7Iu3WQ7mbGjqzpQ",
    authDomain: "appchat-27fee.firebaseapp.com",
    projectId: "appchat-27fee",
    storageBucket: "appchat-27fee.appspot.com",
    messagingSenderId: "231432078446",
    appId: "1:231432078446:web:f62272982a0936c655527f",
    measurementId: "G-M8Q4MGM8TS",
    databaseURL:
        "https://appchat-27fee-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Get Database
const db = getDatabase(firebase);

// Get auth
const auth = getAuth(firebase);

const storage = getStorage(firebase);

//  if (window.location.hostname === "localhost") {
//      // Point to the RTDB emulator running on localhost.
//      connectDatabaseEmulator(db, "localhost", 9000);
//      connectAuthEmulator(auth, "http://localhost:9099");
//      connectStorageEmulator(storage, "localhost", 9199);
//  }
export const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "redirect",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
    ],
};

export { firebase, auth, db, storage };
