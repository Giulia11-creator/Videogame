import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserAuth } from "./context/AuthContext";
import TextBox from "./ReactComponents/TextBox";

function Overlay({ score }) {
  const navigate = useNavigate();
  return createPortal(
    <div style={{ position:"fixed", top:20, right:28, zIndex:2147483647, background:"rgba(255,255,255,.95)", padding:"14px 22px", borderRadius:12, fontWeight:"bold" }}>
      <span>Punteggio: {score}</span>
      <button onClick={() => navigate("/leader")}>🏆 Classifica</button>
    </div>,
    document.body
  );
}

export default function ReactUI() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = UserAuth();

  useEffect(() => {
    const run = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "TravelLevel", user.uid));
        setPoints(snap.exists() ? (snap.data().points ?? 0) : 0); // points è NUMBER
      } catch (e) {
        console.error("getDoc error:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  return (
    <>
      <TextBox />
      {!loading && <Overlay score={points} />}
    </>
  );
}
