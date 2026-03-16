import { useEffect, useRef } from "react";
import "../styles/game.css";
import initGame from "../initGame.js";
import ReactUI from "../ReactUI.jsx";

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

function clearSessionStorageExcept(keepKeys = []) {
  Object.keys(sessionStorage).forEach((key) => {
    if (!keepKeys.includes(key)) {
      sessionStorage.removeItem(key);
    }
  });
}

export default function GamePage() {
  useViewportScale();

  const startedRef = useRef(false);

  // AGGIUNTO:
  // ref React per il canvas (più sicuro di getElementById)
  const canvasRef = useRef(null);

  useEffect(() => {

    // AGGIUNTO:
    // blocca eventuale doppia inizializzazione
    if (startedRef.current) return;

    // Disattiva stile Start/Login, attiva stile Game
    document.body.classList.remove("ui-screen");
    document.body.classList.add("in-game");

    //wipeAllClientSession();
    clearSessionStorageExcept(["flag1", "flag2", "flag3"]);

    // CAMBIATO:
    // prima usavi document.getElementById("game")
    const c = canvasRef.current;

    if (!c) return;

    // Canvas full-screen + focus tastiera
    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100vw";
    c.style.height = "100vh";
    c.style.display = "block";
    c.style.zIndex = "0";
    c.style.background = "#000";

    // CAMBIATO:
    // React preferisce tabIndex
    c.setAttribute("tabIndex", "0");

    // AGGIUNTO:
    // focus nel frame successivo per sicurezza
    requestAnimationFrame(() => {
      c.focus();
    });

    // CAMBIATO:
    // initGame parte solo una volta
    startedRef.current = true;
    initGame();

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
      {/* CAMBIATO:
          aggiunto ref al canvas */}
      <canvas id="game" ref={canvasRef}></canvas>

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