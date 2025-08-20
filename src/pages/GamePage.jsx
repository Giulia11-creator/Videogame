import { useEffect, useRef, useState } from "react";
import "../styles/game.css";
import initGame from "../initGame.js";
import ReactUI from "../ReactUI.jsx";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // usa il tuo export

// scala l’overlay 1920×1080 in base al viewport
function useViewportScale() {
  useEffect(() => {
    const setScale = () => {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      document.documentElement.style.setProperty("--scale", Math.min(sx, sy));
    };
    setScale();
    window.addEventListener("resize", setScale);
    return () => window.removeEventListener("resize", setScale);
  }, []);
}

function wipeAllClientSession() {
  // Svuota tutto lo storage della sessione
  sessionStorage.clear();
}



export default function GamePage() {
  useViewportScale();
  const startedRef = useRef(false);

  useEffect(() => {
    // Disattiva stile Start/Login, attiva stile Game
    document.body.classList.remove("ui-screen");
    document.body.classList.add("in-game");
    wipeAllClientSession();

    if (!startedRef.current) {
      startedRef.current = true;
      initGame();
    }

    // Canvas full-screen + focus tastiera
    const c = document.getElementById("game");
    if (c) {
      c.style.position = "fixed";
      c.style.inset = "0";
      c.style.width = "100vw";
      c.style.height = "100vh";
      c.style.display = "block";
      c.style.zIndex = "0";
      c.style.background = "#000";
      c.setAttribute("tabindex", "0");
      c.focus();
    }

    // cleanup
    return () => {
      document.body.classList.remove("in-game");
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, c.width, c.height);
      }
      startedRef.current = false;
    };
  }, []);

  return (
    <>
      <canvas id="game"></canvas>

      {/* Overlay React sopra al canvas:
          - .ui-viewport è il frame 1920×1080 che si scala con --scale
          - dentro ReactUI rendi cliccabili i blocchi con className="ui-clickable" */}
      <div className="ui-layer">
        <div className="ui-viewport">
          <ReactUI />
        </div>
      </div>
    </>
  );
}
