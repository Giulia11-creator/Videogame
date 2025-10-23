import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserAuth } from "./context/AuthContext";
import TextBox from "./ReactComponents/TextBox";

function Overlay({ score }) {
  const navigate = useNavigate();
 const { user, logout } = UserAuth();
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 28,
        zIndex: 2147483647,
        background: "rgba(255,255,255,0.95)",
        padding: "12px 18px",
        borderRadius: 12,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}
    >

      <button
        type="button"
        onClick={() => { sessionStorage.clear(); logout(); navigate("/"); }}
        style={{
          background: "#ff4d4d",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        ⏻ Esci
      </button>
      <span style={{ fontSize: "16px" }}>
        Punteggio: <span style={{ color: "#333" }}>{score}</span>
      </span>
      <button
        onClick={() => navigate("/leader")}
        style={{
          background: "#ffcc00",
          border: "none",
          borderRadius: 8,
          padding: "6px 12px",
          cursor: "pointer",
          fontWeight: "bold"

        }}
      >
        🏆 Classifica
      </button>
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
        const snap = await getDoc(doc(db, "Leaderboard", user.uid));
        setPoints(snap.exists() ? (snap.data().totalPoints ?? 0) : 0); // points è NUMBER
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
