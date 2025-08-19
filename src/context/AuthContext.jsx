// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const UserContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const createUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const created = userCredential.user;

    await setDoc(doc(db, "users", created.uid), {
      id: created.uid,
      email: created.email,
      createdAt: new Date().toISOString()
    });

    return userCredential;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, createUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function UserAuth() {
  return useContext(UserContext);
}
