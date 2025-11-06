import { useEffect, useState, useCallback } from "react";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";
import { UserAuth } from "../context/AuthContext";
import "../styles/Event.css"; // importa lo stile
import { useNavigate } from "react-router-dom";
import LevelCompleted from "../ReactComponents/LevelCompleted.jsx";
import EndTimer from "../ReactComponents/EndTimer.jsx";
export default function EventFormBug() {
  const DURATION = 20 * 60;
  const [seconds, setseconds] = useState(() => {
    const saved = sessionStorage.getItem("timer");
    return saved ? Number(saved) : DURATION;
  });
  const [finished, setfinished] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState(0);
  const [msg, setMsg] = useState("");
  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem("score");
    return saved ? JSON.parse(saved) : 0;
  });
  const [modal, setModalVisible] = useState(false);
  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });

  const [bugNoTitle, setbugNoTitle] = useState(() => {
    const saved = sessionStorage.getItem("bugNoTitle");
    return saved ? JSON.parse(saved) : false;
  });
  const [bugNoLocation, setbugNoLocation] = useState(() => {
    const saved = sessionStorage.getItem("bugNoLocation");
    return saved ? JSON.parse(saved) : false;
  });
  const [bugWrongDate, setbugWrongDate] = useState(() => {
    const saved = sessionStorage.getItem("bugWrongDate");
    return saved ? JSON.parse(saved) : false;
  });
  const [bugNegativePeople, setbugNegativePeople] = useState(() => {
    const saved = sessionStorage.getItem("bugNegativePeople");
    return saved ? JSON.parse(saved) : false;
  });
  const [bugPastDate, setbugPastDate] = useState(() => {
    const saved = sessionStorage.getItem("bugPastDate");
    return saved ? JSON.parse(saved) : false;
  });

  const [errorMessage, seterrorMessage] = useState("");
  const [popVisible, setpopVisible] = useState(false);
  const [dateEvent, setdateEvent] = useState("");
  const [events, setEvents] = useState([]);
  const { user } = UserAuth();
  const navigate = useNavigate();

  function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
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
  const timerState = seconds <= 30 ? "danger" : seconds <= 60 ? "warning" : "ok";
  const elapsed = DURATION - seconds;
  const formatTime = useCallback(() => {
    const minutes = Math.floor(elapsed / 60);
    const Seconds = elapsed % 60;
   

    return `${String(minutes).padStart(2, "0")}:${String(Seconds).padStart(2, "0")}`;
  }, [elapsed]);
  useEffect(() => {
    sessionStorage.setItem("score", JSON.stringify(score));
    sessionStorage.setItem("clicks", JSON.stringify(clicks));

    (async () => {
      if (user) {
        await addUser("EventsLevel", user.uid, {
          score,
          totalClicks: clicks,
          email: user.email,
          time: formatTime()
        });
      }
    })();
  }, [score, clicks, user, seconds, formatTime]);

  useEffect(() => {
    if (score === 100) {
      setModalVisible(true);
    }
  }, [score]);

  function resetError() {
    setpopVisible(false);
    seterrorMessage("");
  }

  function isPastDate(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset ore
    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate < today;
  }

  function addEvent() {
    const newEvent = {
      title,
      location,
      eventDate: dateEvent,
      eventParticipants: participants === 0 ? 1 : participants,
      backupDate: dateEvent,
    };

    if ((events.length + 1) % 3 === 0 && events.length > 0) {
      const addDays = Math.floor(Math.random() * 30) + 1;
      const wrongDate = new Date();
      wrongDate.setDate(wrongDate.getDate() + addDays);
      newEvent.eventDate = wrongDate.toISOString().split("T")[0];
    }

    if (newEvent.eventDate === "") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      newEvent.eventDate = tomorrow.toISOString().split("T")[0];
    }

    if (isPastDate(newEvent.eventDate)) setbugPastDate(true);

    const titleOnlySpaces = /^ +$/.test(newEvent.title);
    const locationOnlySpaces = /^ +$/.test(newEvent.location);

    if (newEvent.title === "" || titleOnlySpaces) setbugNoTitle(true);
    if (newEvent.location === "" || locationOnlySpaces) setbugNoLocation(true);

    setEvents([...events, newEvent]);
    setMsg("Evento aggiunto!");
    setTitle("");
    setLocation("");
    setParticipants(0);
  }

  const ClickDate = (event) => {
    incrementClicks();
    const dateBackup = event.backupDate;
    if (event.eventDate !== dateBackup) {
      setbugWrongDate(true);
    }
  };

  const CheckParticipants = (event) => {
    incrementClicks();
    if (event.eventParticipants < 0) {
      setbugNegativePeople(true);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    addEvent();
  }

  function BackToGame() {
    incrementClicks();
    navigate("/game");
  }

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("flag2", true);
    }
  }, [user]);
  // 🎯 BUG: Evento senza luogo
  useEffect(() => {
    if (!bugNoLocation) return;
    const awardedbugNoLocation = sessionStorage.getItem("awardedbugNoLocation");
    if (awardedbugNoLocation) return;
    if (!user?.uid || !user?.email) return;
    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
        nick: user.email,
      });
      setscore((prev) => {
        const next = prev + 20;
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("awardedbugNoLocation", "true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un bug di validazione: l’app consente di creare un evento senza specificare il luogo. I bug di validazione si hanno quando il sistema non verifica dati essenziali."
    );
    setpopVisible(true);
  }, [bugNoLocation, user]);

  // 🎯 BUG: Evento senza titolo
  useEffect(() => {
    if (!bugNoTitle) return;
    const awardedbugNoTitle = sessionStorage.getItem("awardedbugNoTitle");
    if (awardedbugNoTitle) return;
    if (!user?.uid || !user?.email) return;
    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
        nick: user.email,
      });
      setscore((prev) => {
        const next = prev + 20;
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("awardedbugNoTitle", "true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un bug di validazione: l’app ti lascia creare un evento senza titolo. I bug di validazione si verificano quando mancano controlli sui campi obbligatori. È come stampare una locandina di un concerto senza scrivere il nome dell’evento."
    );
    setpopVisible(true);
  }, [bugNoTitle, user]);

  // 🎯 BUG: Data che cambia ogni 3 eventi (flaky)
  useEffect(() => {
    if (!bugWrongDate) return;
    const awardedbugWrongDate = sessionStorage.getItem("awardedbugWrongDate");
    if (awardedbugWrongDate) return;
    if (!user?.uid || !user?.email) return;
    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
        nick: user.email,
      });
      setscore((prev) => {
        const next = prev + 20;
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("awardedbugWrongDate", "true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un flaky bug: ogni tre eventi creati, la data di uno si modifica da sola senza motivo. Un flaky bug è un errore instabile e imprevedibile, che non si manifesta sempre nello stesso modo. È come se la data di un compleanno sul calendario cambiasse da sola ogni tanto."
    );
    setpopVisible(true);
  }, [bugWrongDate, user]);

  // 🎯 BUG: Evento in data passata
  useEffect(() => {
    if (!bugPastDate) return;
    const awardedbugPastDate = sessionStorage.getItem("awardedbugPastDate");
    if (awardedbugPastDate) return;
    if (!user?.uid || !user?.email) return;
    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
        nick: user.email,
      });
      setscore((prev) => {
        const next = prev + 20;
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("awardedbugPastDate", "true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un bug di validazione: l’app permette di creare un evento in una data già passata. I bug di validazione sono errori nei controlli logici sugli input. È come fissare una riunione ieri: non ha senso e il sistema dovrebbe impedirlo."
    );
    setpopVisible(true);
  }, [bugPastDate, user]);

  // 🎯 BUG: Numero negativo di persone
  useEffect(() => {
    if (!bugNegativePeople) return;
    const awardedbugNegativePeople = sessionStorage.getItem(
      "awardedbugNegativePeople"
    );
    if (awardedbugNegativePeople) return;
    if (!user?.uid || !user?.email) return;
    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
        nick: user.email,
      });
      setscore((prev) => {
        const next = prev + 20;
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("awardedbugNegativePeople", "true");
        return next;
      });
    })();
    seterrorMessage(
      "Hai trovato un bug di validazione: l’app ti permette di inserire un numero negativo di persone per un evento. Un bug di validazione è quando il sistema non controlla correttamente i dati inseriti dall’utente. È come organizzare una festa per –5 invitati: assurdo, ma l’app lo accetta."
    );
    setpopVisible(true);
  }, [bugNegativePeople, user]);

  return (
    <div className="page-container">
      <div className="top-bar">
        <button className="exit-button" onClick={BackToGame}>
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

        <div className="score-chip" aria-live="polite" title="Punteggio">
          <span onClick={incrementClicks} className="score-label">
            Punteggio
          </span>
          <span onClick={incrementClicks} className="score-value">
            {score}
          </span>
        </div>
      </div>

      <h1 onClick={incrementClicks} className="page-title">
        🎉 Party Planner – Crea la tua Festa! 🎉
      </h1>

      <form onSubmit={handleSubmit} className="event-form">
        <input
          placeholder="Titolo evento"
          value={title}
          onClick={incrementClicks}
          maxLength={30}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Luogo"
          value={location}
          maxLength={30}
          onClick={incrementClicks}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Numero partecipanti"
          value={participants}
          onClick={incrementClicks}
          onChange={(e) => setParticipants(Number(e.target.value))}
        />
        <label className="field">
          <span onClick={incrementClicks}>Data evento</span>
          <input
            onClick={incrementClicks}
            id="DIn"
            type="date"
            min={`${new Date().getFullYear()}-01-01`}
            onChange={(e) => setdateEvent(e.target.value)}
          />
        </label>
        <button type="submit" onClick={incrementClicks}>
          ➕ Crea evento
        </button>
      </form>

      <p className="message">{msg}</p>

      <div className="events-grid">
        {events.map((ev, i) => (
          <div key={i} className="event-card">
            <h4 onClick={incrementClicks}>{ev.title}</h4>
            <p onClick={incrementClicks}>
              <strong>Luogo:</strong> {ev.location}
            </p>
            <p onClick={() => ClickDate(ev)}>
              <strong>Data:</strong> {ev.eventDate.toLocaleString()}
            </p>
            <p onClick={() => CheckParticipants(ev)}>
              <strong>Partecipanti:</strong> {ev.eventParticipants}
            </p>
          </div>
        ))}
      </div>

      {modal && (
        <div>
          <LevelCompleted />
        </div>
      )}

      {finished && (
        <div>
          {" "}
          <EndTimer />{" "}
        </div>
      )}

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
