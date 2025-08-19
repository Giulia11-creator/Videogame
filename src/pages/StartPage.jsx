import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ui.css";
import logo from "/public/logo.png";
export default function StartPage() {
  // Attiva lo stile della schermata UI e rimuovilo all'uscita
  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <img src={logo} alt="Logo Bugged Out" width={400} />
      <center><Link to="/login">Vai al Login</Link></center>
      
    </div>
  );
}
