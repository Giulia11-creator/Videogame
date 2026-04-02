import { useEffect, useRef } from "react";
import "../styles/game.css";
import initGame from "../initGame.js";
import ReactUI from "../ReactUI.jsx";

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
  const canvasRef = useRef(null);

  useEffect(() => {
    if (startedRef.current) return;

    document.body.classList.remove("ui-screen");
    document.body.classList.add("in-game");
    clearSessionStorageExcept(["flag1", "flag2", "flag3","tutorialDone","TutorialTime","triggerExampleOne","triggerExampleTwo","triggerExampleThree"]);

    const c = canvasRef.current;
    if (!c) return;

    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100vw";
    c.style.height = "100vh";
    c.style.display = "block";
    c.style.zIndex = "0";
    c.style.background = "#000";
    c.setAttribute("tabIndex", "0");

    const focusCanvas = () => {
      requestAnimationFrame(() => {
        c.focus();
      });
    };

    focusCanvas();

    const handleMouseDown = (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest(".ui-clickable")) return;
      focusCanvas();
    };

    const handleWindowFocus = () => {
      focusCanvas();
    };

    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("focus", handleWindowFocus);

    startedRef.current = true;
    initGame();

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("focus", handleWindowFocus);

      document.body.classList.remove("in-game");

      const ctx = c.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, c.width, c.height);

      startedRef.current = false;
    };
  }, []);

  return (
    <>
      <canvas id="game" ref={canvasRef}></canvas>

      <div className="ui-layer">
        <div className="ui-viewport">
          <ReactUI />
        </div>
      </div>
    </>
  );
}