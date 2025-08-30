import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyADhWfT0EGHTS-lLKPN_H4Hef9WFsApSPQ",
  authDomain: "acadimia-1994.firebaseapp.com",
  projectId: "acadimia-1994",
  storageBucket: "acadimia-1994.firebasestorage.app",
  messagingSenderId: "384160023675",
  appId: "1:384160023675:web:d303056a17bdcb63004ede",
  measurementId: "G-VBX1RJHXVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)