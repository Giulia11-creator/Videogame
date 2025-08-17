import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import { Provider } from "jotai";
import { store } from "./store.js";

import initGame from "./initGame.js";
import ReactUI from "./ReactUI.jsx";

/** CSS globale: font + reset viewport (NON mettere più index.css) */
import "./styles/base.css";

/* Hook: scala l'overlay logico 1920x1080 sul viewport reale */
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

/* --- PAGINE --- */
function StartPage() {
  useViewportScale();

  // carica CSS UI solo per questa pagina
  useEffect(() => { import("./styles/ui.css"); }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Start Page</h1>
      <p>Router ok ✅</p>
      <Link to="/login">Vai al Login</Link>
    </div>
  );
}

function LoginPage() {
  useViewportScale();

  // carica CSS UI solo per questa pagina
  useEffect(() => { import("./styles/ui.css"); }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login Page</h1>
      <Link to="/game">Entra nel gioco</Link>
    </div>
  );
}

function GamePage() {
  useViewportScale();

  // carica CSS del gioco solo quando entri in /game
  useEffect(() => { import("./styles/game.css"); }, []);

  useEffect(() => {
    // in game: lascia passare gli input alla canvas
    const body = document.body;
    body.classList.add("in-game");

    const uiRoot = document.getElementById("ui");
    const prevPE = uiRoot?.style.pointerEvents;
    if (uiRoot) uiRoot.style.pointerEvents = "none";

    // avvia Kaplay + sprites
    initGame();

    // canvas full-screen + focus tastiera
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
      body.classList.remove("in-game");
      if (uiRoot) uiRoot.style.pointerEvents = prevPE ?? "auto";
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, c.width, c.height);
      }
    };
  }, []);

  return (
    <>
      {/* Kaplay si aggancia a questo id */}
      <canvas id="game"></canvas>

      {/* Overlay React sopra al canvas.
         - .ui-layer: non cattura eventi di default (definito in game.css)
         - .ui-viewport: 1920x1080 scalato con --scale
         - Dentro ReactUI, rendi cliccabili i blocchi con className="ui-clickable" */}
      <div className="ui-layer">
        <div className="ui-viewport">
          <ReactUI />
        </div>
      </div>
    </>
  );
}

/* --- MOUNT --- */
createRoot(document.getElementById("ui")).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>
);
