import "../styles/Library.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";
import LevelCompleted from "../ReactComponents/LevelCompleted.jsx";
import EndTimer from "../ReactComponents/EndTimer.jsx";

export default function CheckoutPage() {
  const [modal, setModalVisible] = useState(false);
  const [popVisible, setpopVisible] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [libri, setLibri] = useState(() => {
    // recupero i libri prenotati da sessionStorage
    return JSON.parse(sessionStorage.getItem("books") || "[]");
  });

  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });

  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem("score");
    return saved ? JSON.parse(saved) : 0;
  });

  const [bugWrongAuthor, setbugWrongAuthor] = useState(() => {
    const saved = sessionStorage.getItem("bugWrongAuthor");
    return saved ? JSON.parse(saved) : false;
  });
  const { user } = UserAuth();

  const navigate = useNavigate();

  const DURATION = 20 * 60;
  const [seconds, setseconds] = useState(() => {
    const saved = sessionStorage.getItem("timer");
    return saved ? Number(saved) : DURATION;
  });
  const [finished, setfinished] = useState(false);

  function resetError() {
    setpopVisible(false);
    seterrorMessage("");
  }

  function handleCheckout() {
    incrementClicks();
    navigate("/library");
    alert("✅ Prenotazione effettuata con successo!");
    sessionStorage.removeItem("books");
    setLibri([]);
    navigate("/library");
  }

  function handleCheckoutLibrary() {
    incrementClicks();
    sessionStorage.removeItem("books");
    setLibri([]);
    navigate("/library");
  }

  function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      sessionStorage.setItem("clicks", JSON.stringify(next));
      return next; // importante restituire il nuovo valore
    });
  }

  useEffect(() => {
    if (seconds <= 0) {
      setfinished(true);
      return;
    }
    const id = setInterval(() => {
      setseconds((prev) => {
        const next = prev - 1;
        sessionStorage.setItem("timer", next);
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const elapsed = DURATION - seconds;
  const formatTime = useCallback(() => {
    const minutes = Math.floor(elapsed / 60);
    const Seconds = elapsed % 60;
    return `${String(minutes).padStart(2, "0")}:${String(Seconds).padStart(2, "0")}`;
  }, [elapsed]);
  const timerState =
    seconds <= 30 ? "danger" : seconds <= 60 ? "warning" : "ok";

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
    const timer = setTimeout(() => {
      setLibri((prev) =>
        prev.map((b) => (b.id === 6 ? { ...b, autore: "G.Bertoli" } : b)),
      );
    }, randomDelay);
    return () => clearTimeout(timer);
  }, []);

  function handleClickAuthor(book) {
    incrementClicks();
    if (book.rightAutore != "" && book.autore != book.rightAutore)
      setbugWrongAuthor(true);
  }

  useEffect(() => {
    if (!bugWrongAuthor) return;
    const alreadyAwarded = sessionStorage.getItem("awardedbugWrongAuthor");
    if (alreadyAwarded) return;
    if (!user?.uid || !user?.email) return;

    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
        nick: user.email,
      });

      setscore((prev) => {
        const next = prev + 20;
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("awardedbugWrongAuthor", "true");
        sessionStorage.setItem("bugWrongAuthor","true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un flaky bug: il nome dell’autore del libro cambia improvvisamente senza motivo. A volte rimane corretto, altre volte si trasforma in un altro nome. Questo è un bug instabile, perché lo stesso scenario può produrre risultati diversi.",
    );
    setpopVisible(true);
  }, [bugWrongAuthor, user]);

  useEffect(() => {
    if (user) {
      (async () => {
        await addUser("BookLevel", user.uid, {
          score,
          Totalclicks: clicks,
          email: user.email,
          time: formatTime(),
          bugs: {
            bugChangeColor: sessionStorage.getItem("bugChangeColor") === "true",
            bugTrasparentButton:
              sessionStorage.getItem("bugTrasparentButton") === "true",
            bugWrongBooked: sessionStorage.getItem("bugWrongBooked") === "true",
            bugWrongYear: sessionStorage.getItem("bugWrongYear") === "true",
            bugWrongAuthor: bugWrongAuthor,
          },
        });
      })();
    }
  }, [score, clicks, user, seconds, formatTime, bugWrongAuthor]);

  useEffect(() => {
    if (score === 100) {
      const timer = setTimeout(() => {
        setModalVisible(true);
      }, 4000); // 4 secondi

      return () => clearTimeout(timer); // cleanup importante
    }
  }, [score]);

  return (
    <div>
      <div className="container with-top-right">
        <div className="topbar">
          <button className="btn-exit" onClick={handleCheckoutLibrary}>
            Torna alla libreria
          </button>
          <div
            className={`timer-badge ${timerState}`}
            aria-live="polite"
            title="Tempo rimanente"
          >
            <span className="label">Timer</span>
            <span className="value">
              {minutes}:{remainingSeconds.toString().padStart(2, "0")}
            </span>
            <span className="dot" aria-hidden />
          </div>

          <div className="topbar-right">
            <span className="score-chip">
              <span onClick={incrementClicks} className="score-label">
                Libri prenotati
              </span>
              <span onClick={incrementClicks} className="score-value">
                {libri.length}
              </span>
            </span>
          </div>
        </div>

        <h1 onClick={incrementClicks} className="hero-title">
          🛒 Checkout
        </h1>

        {libri.length === 0 ? (
          <p
            onClick={incrementClicks}
            style={{ fontSize: "1.1rem", marginTop: "20px" }}
          >
            Nessun libro prenotato.
          </p>
        ) : (
          <>
            <div className="cards">
              {libri.map((libro) => (
                <div key={libro.id} className="card">
                  <div className="card-body">
                    <div className="title-row">
                      <div onClick={incrementClicks} className="title">
                        {libro.titolo}
                      </div>
                      <span
                        onClick={incrementClicks}
                        className="badge-state badge-busy"
                      >
                        PRENOTATO
                      </span>
                    </div>
                    <div className="meta">
                      <p onClick={() => handleClickAuthor(libro)}>
                        {libro.autore}
                      </p>
                      <p onClick={incrementClicks}>{libro.anno}</p>
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
      {modal && <LevelCompleted />}
      {finished && <EndTimer />}
      {popVisible && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={resetError}>
              &times;
            </button>
            <strong>Complimenti!</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
