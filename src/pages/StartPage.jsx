import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ui.css";

export default function StartPage() {
  const navigate = useNavigate();

  // Attiva lo stile della schermata UI e rimuovilo all'uscita
  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 200 }}>
      <h1>Benvenuto al gioco</h1>
      <button onClick={() => navigate("/login")}>Start</button>
    </div>
  );
}
