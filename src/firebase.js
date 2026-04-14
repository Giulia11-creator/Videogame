import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDil1SceibQAAwoz-5oB1Hq5_kbNYga3tg",
  authDomain: "gioco1-ed728.firebaseapp.com",
  projectId: "gioco1-ed728",
  storageBucket: "gioco1-ed728.firebasestorage.app",
  messagingSenderId: "268612101865",
  appId: "1:268612101865:web:46a6cfca7123d24f493278",
  measurementId: "G-CGVZ9NMEV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;