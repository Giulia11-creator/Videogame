import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8JLIncGh6L0xApLxyaOQxnVJeAxHcF-M",
  authDomain: "gioco-20204.firebaseapp.com",
  databaseURL: "https://gioco-20204-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gioco-20204",
  storageBucket: "gioco-20204.firebasestorage.app",
  messagingSenderId: "1080127846619",
  appId: "1:1080127846619:web:2efb0ce437cd605e5e74fe",
  measurementId: "G-KB17CKGFVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;