import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import { Provider } from "jotai";
import { store } from "./store.js";
import LoginPage from "./pages/LoginPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import GamePage from "./pages/GamePage.jsx";

/** CSS globale: font + reset viewport*/
import "./styles/base.css";

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
