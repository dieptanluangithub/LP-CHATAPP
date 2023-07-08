import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDRzjXtiWnip7G2Z_DXFBHL2yh1zrJMOJ8",
  authDomain: "zoom-b5c90.firebaseapp.com",
  projectId: "zoom-b5c90",
  storageBucket: "zoom-b5c90.appspot.com",
  messagingSenderId: "417367495136",
  appId: "1:417367495136:web:06d21224cc890c0769db85"
};

const app = initializeApp(firebaseConfig, "zoomMeetings");
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");
