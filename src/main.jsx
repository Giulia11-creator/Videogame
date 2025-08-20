import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import { Provider } from "jotai";
import { store } from "./store.js";
import LoginPage from "./pages/LoginPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TravelPage from "./pages/TravelPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import { AuthContextProvider } from "./context/AuthContext";
/** CSS globale: font + reset viewport*/
import "./styles/base.css";

createRoot(document.getElementById("ui")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/travel" element={<TravelPage />} />
             <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/leader" element={<LeaderboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthContextProvider>
    </Provider>
  </StrictMode>
);
