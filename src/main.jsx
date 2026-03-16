import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "jotai";
import { store } from "./store.js";
import LoginPage from "./pages/LoginPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TravelPage from "./pages/TravelPage.jsx";
import Tutorial from "./pages/Tutorial.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import EventPage from "./pages/EventPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import CheckoutLibraryPage from "./pages/CheckoutLibrary.jsx";
/** CSS globale: font + reset viewport*/
import "./styles/base.css";

createRoot(document.getElementById("ui")).render(
  <Provider store={store}>
    <AuthContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/leader" element={<LeaderboardPage />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/checkoutL" element={<CheckoutLibraryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthContextProvider>
  </Provider>
);