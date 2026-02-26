import "../styles/Library.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";
import LevelCompleted from "../ReactComponents/LevelCompleted.jsx";
import EndTimer from "../ReactComponents/EndTimer.jsx";

export default function LibraryPage() {
  const [libri, setLibri] = useState([
    {
      id: 1,
      titolo: "Il nome della rosa",
      autore: "U. Eco",
      rightAutore: "",
      anno: 1980,
      rightAnno: 1980,
      stato: "libero",
      descr: "Giallo storico in abbazia.",
    },
    {
      id: 2,
      titolo: "1984",
      autore: "G. Orwell",
      rightAutore: "",
      anno: 1949,
      stato: "libero",
      descr: "Distopia sul controllo.",
    },
    {
      id: 3,
      titolo: "La coscienza di Zeno",
      autore: "I. Svevo",
      rightAutore: "",
      anno: 1923,
      stato: "libero",
      descr: "Romanzo psicologico.",
    },
    {
      id: 4,
      titolo: "Il Signore degli Anelli",
      autore: "J.R.R. Tolkien",
      rightAutore: "",
      anno: 1954,
      stato: "libero",
      descr: "Avventura epica.",
    },
    {
      id: 5,
      titolo: "Sapiens",
      autore: "Y.N. Harari",
      anno: 2011,
      stato: "libero",
      descr: "Breve storia dell'umanità.",
    },
    {
      id: 6,
      titolo: "La Divina Commedia",
      autore: "D. Alighieri",
      rightAutore: "D. Alighieri",
      anno: 1320,
      stato: "libero",
      descr: "Inferno, Purgatorio, Paradiso.",
    },
  ]);

  const DURATION = 20 * 60;
  const navigate = useNavigate();
  const liberi = libri.filter((l) => l.stato === "libero").length;
  const prenotati = libri.reduce((sum, l) => {
    if (l.stato !== "prenotato") return sum;
    return sum + (l.id === 2 ? 2 : 1);
  }, 0);

  const [seconds, setseconds] = useState(() => {
    const saved = sessionStorage.getItem("timer");
    return saved ? Number(saved) : DURATION;
  });
  const [finishedTime, setFinishedTimer] = useState(false);
  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem("score");
    return saved ? JSON.parse(saved) : 0;
  });
  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });

  const [bugWrongBooked, setbugWrongBooked] = useState(() => {
    const saved = sessionStorage.getItem("bugWrongBooked");
    return saved ? JSON.parse(saved) : false;
  });

  const [bugWrongYear, setbugWrongYear] = useState(() => {
    const saved = sessionStorage.getItem("bugWrongYear");
    return saved ? JSON.parse(saved) : false;
  });

  const [bugTrasparentButton, setbugTrasparentButton] = useState(() => {
    const saved = sessionStorage.getItem("bugTrasparentButton");
    return saved ? JSON.parse(saved) : false;
  });

  const [bugChangeColor, setbugChangeColor] = useState(() => {
    const saved = sessionStorage.getItem("bugChangeColor");
    return saved ? JSON.parse(saved) : false;
  });

  const [TrasparentButton, setTrasparentButton] = useState(false);
  const [ChangeColor, setChangeColor] = useState(false);
  const TRANSPARENT_BTN_BOOK_ID = 3;

  const { user } = UserAuth();

  const [modal, setModalVisible] = useState(false);
  const [popVisible, setpopVisible] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");

  function BackToGame() {
    incrementClicks();
    navigate("/game");
  }

  function saveBook(book) {
    let books = JSON.parse(sessionStorage.getItem("books") || "[]");
    if (!books.some((b) => b.id === book.id)) {
      books.push({
        id: book.id,
        titolo: book.titolo,
        autore: book.autore,
        rightAutore: book.rightAutore,
        anno: book.anno,
      });
      sessionStorage.setItem("books", JSON.stringify(books));
    }
  }
  function resetError() {
    setpopVisible(false);
    seterrorMessage("");
  }

  function removeBook(id) {
    let books = JSON.parse(sessionStorage.getItem("books") || "[]");
    books = books.filter((b) => b.id !== id);
    sessionStorage.setItem("books", JSON.stringify(books));
  }

  function handlePrenotaClick(book) {
    incrementClicks();
    const isLibero = book.stato === "libero";
    if (isLibero) saveBook(book);
    else removeBook(book.id);
    if (TrasparentButton) setbugTrasparentButton(true);
    setLibri((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? { ...b, stato: isLibero ? "prenotato" : "libero" }
          : b,
      ),
    );
  }

  function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      sessionStorage.setItem("clicks", JSON.stringify(next));
      return next; // importante restituire il nuovo valore
    });
  }

  function handleClickBooked() {
    incrementClicks();
    let books = JSON.parse(sessionStorage.getItem("books") || "[]");
    if (prenotati > books.length) setbugWrongBooked(true);
  }

  useEffect(() => {
    if (seconds <= 0) {
      setFinishedTimer(true);
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
  const timerState =
    seconds <= 30 ? "danger" : seconds <= 60 ? "warning" : "ok";
  const elapsed = DURATION - seconds;
  const formatTime = useCallback(() => {
    const minutes = Math.floor(elapsed / 60);

    const Seconds = elapsed % 60;
    return `${String(minutes).padStart(2, "0")}:${String(Seconds).padStart(2, "0")}`;
  }, [elapsed]);
  useEffect(() => {
    if (!bugWrongYear) return;
    const alreadyAwarded = sessionStorage.getItem("awardedbugWrongYear");
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
        sessionStorage.setItem("awardedbugWrongYear", "true");
        sessionStorage.setItem("bugWrongYear","true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un flaky bug: l’anno di edizione del libro cambia all’improvviso. In certi casi resta quello giusto, in altri si aggiorna in modo casuale. Anche qui il comportamento è incoerente e imprevedibile, tipico dei bug flaky.",
    );
    setpopVisible(true);
  }, [bugWrongYear, user]);

  useEffect(() => {
    if (!bugTrasparentButton) return;
    const alreadyAwarded = sessionStorage.getItem("awardedbugTrasparentButton");
    if (alreadyAwarded) return;
    if (!user?.uid || !user?.email) return;

    const Delay = 1500;
    const timer = setTimeout(() => {
      (async () => {
        await shootConfetti();
        await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
          nick: user.email,
        });

        setscore((prev) => {
          const next = prev + 20;
          sessionStorage.setItem("score", JSON.stringify(next));
          sessionStorage.setItem("awardedbugTrasparentButton", "true");
          sessionStorage.setItem("bugTrasparentButton", "true");
          return next;
        });
      })();
      seterrorMessage(
        "🎉Hai trovato un bug di interfaccia (UI/UX)! Un pulsante è diventato trasparente, ma continua a funzionare se ci clicchi sopra. Questo tipo di bug capita quando l’elemento è ancora attivo ma non visibile, e quindi l’utente può cliccare “nel vuoto” senza capire cosa sta succedendo. È un errore grafico e di esperienza utente, non di logica: l’app funziona, ma l’interfaccia inganna chi la usa.",
      );
      setpopVisible(true);
    }, Delay);
    return () => clearTimeout(timer);
  }, [bugTrasparentButton, user]);

  useEffect(() => {
    // esci se non è stato rilevato il bug
    if (!bugWrongBooked) return;

    const alreadyAwarded =
      sessionStorage.getItem("awardedbugWrongBooked") === "true";
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
        sessionStorage.setItem("awardedbugWrongBooked", "true");
        sessionStorage.setItem("bugWrongBooked", "true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un bug di logica: premendo una volta il pulsante Prenota per un libro, il sistema ne riserva due. In pratica l’applicazione non rispetta la regola di base (una prenotazione corrisponde a un solo libro) e raddoppia l’azione in modo errato.Un bug di logica (o logic bug, spesso anche business logic bug) è un errore che nasce perché il programma non segue correttamente le regole o i ragionamenti per cui è stato progettato.",
    );
    setpopVisible(true);
  }, [bugWrongBooked, user]);

  useEffect(() => {
    if (!bugChangeColor) return;
    const alreadyAwarded = sessionStorage.getItem("awardedbugChangeColor");
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
        sessionStorage.setItem("awardedbugChangeColor", "true");
        sessionStorage.setItem("bugChangeColor", "true");
        return next;
      });
    })();
    seterrorMessage(
      "🎉Hai trovato un bug di interfaccia (UI/UX)! Il titolo ha cambiato colore! È un errore grafico e di esperienza utente, non di logica: l’app funziona, ma l’interfaccia cambia e  inganna chi la usa.",
    );
    setpopVisible(true);
  }, [bugChangeColor, user]);

  useEffect(() => {
    if (score === 100) {
      const timer = setTimeout(() => {
        setModalVisible(true);
      }, 4000); // 4 secondi

      return () => clearTimeout(timer); // cleanup importante
    }
  }, [score]);
  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
    const timer = setTimeout(() => {
      setLibri((prev) =>
        prev.map((b) => (b.id === 1 ? { ...b, anno: "2003" } : b)),
      );
    }, randomDelay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ms = Math.floor(Math.random() * (5000 - 2000 + 1)) + 3000;
    const timer = setTimeout(() => {
      setTrasparentButton(true);
    }, ms);
    return () => clearTimeout(timer);
  }, [TrasparentButton]);

  useEffect(() => {
    const ms = Math.random() * (5000 - 2000 + 1) + 3000;
    const timer = setTimeout(() => {
      setChangeColor(true);
    }, ms);
    return () => clearTimeout(timer);
  }, [ChangeColor]);

  function handleClickYear(book) {
    incrementClicks();
    if (book.id != 1) return;
    else setbugWrongYear(true);
  }

  function handleClickCheckout() {
    incrementClicks();
    navigate("/checkoutL");
  }

  function handleClickTitle() {
    incrementClicks();
    setbugChangeColor(true);
  }

  useEffect(() => {
    if (user) {
      (async () => {
        await addUser("BookLevel", user.uid, {
          score,
          Totalclicks: clicks,
          email: user.email,
          time: formatTime(),
          bugs: {
            bugChangeColor: bugChangeColor,
            bugTrasparentButton: bugTrasparentButton,
            bugWrongBooked: bugWrongBooked,
            bugWrongYear: bugWrongYear,
            bugWrongAuthor: sessionStorage.getItem("bugWrongAuthor") === "true",
          },
        });
      })();
    }
  }, [
    score,
    clicks,
    user,
    seconds,
    formatTime,
    bugChangeColor,
    bugTrasparentButton,
    bugWrongBooked,
    bugWrongYear,
  ]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("flag3", true);
    }
  }, [user]);

  return (
    <div>
      <div className="container with-top-right">
        <div className="topbar">
          <button className="btn-exit" onClick={BackToGame}>
            ⏻ Esci
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
            <button className="btn-checkout" onClick={handleClickCheckout}>
              Checkout
            </button>
            <div className="score-chip" aria-live="polite" title="Punteggio">
              <span onClick={incrementClicks} className="score-label">
                Punteggio
              </span>
              <span onClick={incrementClicks} className="score-value">
                {score}
              </span>
            </div>
          </div>
        </div>

        <h1
          onClick={handleClickTitle}
          className={`hero-title ${ChangeColor ? "Change-color" : ""}`}
        >
          📚🐭 Topi da Biblioteca ✨
        </h1>

        <div className="meta" style={{ marginBottom: 16 }}>
          Totale:{" "}
          <b
            onClick={incrementClicks}
            style={{ marginLeft: 4, marginRight: 12 }}
          >
            {libri.length}
          </b>
          Libri liberi:{" "}
          <b
            onClick={incrementClicks}
            style={{ marginLeft: 4, marginRight: 12 }}
          >
            {liberi}
          </b>
          Prenotati:{" "}
          <b onClick={handleClickBooked} style={{ marginLeft: 4 }}>
            {prenotati}
          </b>
        </div>

        <div className="cards">
          {libri.map((libro) => {
            const libero = libro.stato === "libero";
            return (
              <div key={libro.id} className="card">
                <div className="card-body">
                  <div className="title-row">
                    <div onClick={incrementClicks} className="title">
                      {libro.titolo}
                    </div>
                    <span
                      onClick={incrementClicks}
                      className={`pill ${libero ? "" : ""}`}
                    >
                      {libro.stato.toUpperCase()}
                    </span>
                  </div>
                  <div className="meta">
                    <p onClick={incrementClicks}>{libro.autore} </p>
                    <p onClick={() => handleClickYear(libro)}>{libro.anno}</p>
                  </div>
                  <p onClick={incrementClicks} className="desc">
                    {libro.descr}
                  </p>
                  <button
                    type="button"
                    className={`btn-book ${
                      TrasparentButton && libro.id === TRANSPARENT_BTN_BOOK_ID
                        ? "is-invisible"
                        : ""
                    }`}
                    onClick={() => handlePrenotaClick(libro)}
                  >
                    {libero ? "Prenota" : "Annulla prenotazione"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {modal && <LevelCompleted />}
      {finishedTime && <EndTimer />}
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
