import "../styles/Library.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";

export default function CheckoutPage() {
  const [libri, setLibri] = useState(() => {
    // recupero i libri prenotati da sessionStorage
    return JSON.parse(sessionStorage.getItem("books") || "[]");
  });

  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clickss");
    return saved ? JSON.parse(saved) : 0;
  });

  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem("score");
    return saved ? JSON.parse(saved) : 0;
  });
  const { user } = UserAuth();

  const navigate = useNavigate();


  function handleCheckout() {
    navigate("/library");
    alert("✅ Prenotazione effettuata con successo!");
    // qui puoi aggiungere logica per salvare sul db o svuotare la sessionStorage
    sessionStorage.removeItem("books");
    setLibri([]);
    navigate("/library"); // esempio: torna al gioco
  }

  function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      sessionStorage.setItem("clicks", JSON.stringify(next));
      return next; // importante restituire il nuovo valore
    });
  }

  useEffect(() => {
    sessionStorage.setItem("score", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    sessionStorage.setItem("clicks", JSON.stringify(clicks));
    if (user) {
      (async () => {
        await addUser("BookLevel", user.uid, {
          totalClicks: clicks,
        });
      })();
    }
  }, [clicks, user]);

  return (
    <div>
      <div className="container with-top-right">
        <div className="topbar">
          <div className="topbar-right">
            <span className="score-chip">
              <span className="score-label">Libri prenotati</span>
              <span className="score-value">{libri.length}</span>
            </span>
          </div>
        </div>

        <h1 className="hero-title">🛒 Checkout</h1>

        {libri.length === 0 ? (
          <p style={{ fontSize: "1.1rem", marginTop: "20px" }}>
            Nessun libro prenotato.
          </p>
        ) : (
          <>
            <div className="cards">
              {libri.map((libro) => (
                <div key={libro.id} className="card">
                  <div className="card-body">
                    <div className="title-row">
                      <div className="title">{libro.titolo}</div>
                      <span className="badge-state badge-busy">PRENOTATO</span>
                    </div>
                    <div className="meta">
                      <p>{libro.autore}</p>
                      <p>{libro.anno}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button
                className="btn-checkout"
                style={{ fontSize: "1rem", padding: "10px 20px" }}
                onClick={handleCheckout}
              >
                Effettua prenotazione
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
