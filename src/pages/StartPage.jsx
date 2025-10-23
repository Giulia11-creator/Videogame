import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ui.css";
import logo from "../images/logo.png";
export default function StartPage() {
  // Attiva lo stile della schermata UI e rimuovilo all'uscita
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <img src={logo} alt="Logo Bugged Out" width={400} />
      <center><Link to="/signup">Inizia a giocare</Link></center>
      <button className="btnLead"
        onClick={() => navigate("/leader")}
      >
        🏆 Classifica
      </button>
      
    </div>
  );
}
