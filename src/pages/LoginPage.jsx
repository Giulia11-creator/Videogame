import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ui.css";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);

  const handleLogin = () => {
    // logica di login se serve…
    navigate("/game");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 200 }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Entra nel gioco</button>
    </div>
  );
}
