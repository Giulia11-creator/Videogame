import { useEffect, useState } from "react";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";
import { UserAuth } from "../context/AuthContext";
import "../styles/Event.css"; // importa lo stile
import { useNavigate } from "react-router-dom";
import LevelCompleted from "../ReactComponents/LevelCompleted.jsx";
export default function EventFormBug() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState(0);
  const [msg, setMsg] = useState("");
  const [score, setScore] = useState(0);
  const [modal, setModalVisible] = useState(false);
  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });
  const [dateEvent, setdateEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [bugPastDate, setbugPastDate] = useState(false);
  const [bugNoTitle, setbugNoTitle] = useState(false);
  const [bugNoLocation, setbugNoLocation] = useState(false);
  const [bugWrongDate, setbugWrongDate] = useState(false);
  const [bugNegativePeople, setbugNegativePeople] = useState(false);
  const [awardedbugNoTitle, setawardedbugNoTitle] = useState(false);
  const [awardedbugNoLocation, setawardedbugNoLocation] = useState(false);
  const [awardedbugWrongDate, setawardedbugWrongDate] = useState(false);
  const [awardedbugPastDate, setawardedbugPastDate] = useState(false);
  const [awardedbugNegativePeople, setawardedbugNegativePeople] =
    useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();

  function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      return next; // importante restituire il nuovo valore
    });
  }
  useEffect(() => {
    if (user) {
      (async () => {
        await addUser("EventsLevel", user.uid, {
          score,
          email: user.email,
        });
      })();
    }
  }, [score, user]);

  useEffect(() => {

    if (score == 100)
      setModalVisible(true);

  }, [score])

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
      tomorrow.setDate(tomorrow.getDate() + 1); // aggiunge 1 giorno
      newEvent.eventDate = tomorrow.toISOString().split("T")[0];
    }
    if (new Date(newEvent.eventDate) < new Date()) setbugPastDate(true);

    if (title === "") setbugNoTitle(true);
    if (location === "") setbugNoLocation(true);

    setEvents([...events, newEvent]);
    setMsg("Evento aggiunto!");
    setTitle("");
    setLocation("");
    setParticipants(0);
  }
  const ClickDate = (event) => {
    incrementClicks();
    const dateBackup = event.backupDate;
    if (event.eventDate != dateBackup) {
      setbugWrongDate(true);
    }
  };

  const CheckParticipants = (event) => {
    incrementClicks();
    if (event.eventParticipants < 0) {
      setbugNegativePeople(true);
    }
  };
  useEffect(() => {
    let inc = 0;
    if (bugNoLocation && !awardedbugNoLocation) {
      inc += 20;
      (async () => {
        await shootConfetti();
        await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
          nick: user.email,
        }); //animazione e icremento del punteggio nella classifica
      })();
      setawardedbugNoLocation(true);
    }
    if (bugNoTitle && !awardedbugNoTitle) {
      inc += 20;
      (async () => {
        await shootConfetti();
        await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
          nick: user.email,
        }); //animazione e icremento del punteggio nella classifica
      })();
      setawardedbugNoTitle(true);
    }
    if (bugWrongDate && !awardedbugWrongDate) {
      inc += 20;
      (async () => {
        await shootConfetti();
        await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
          nick: user.email,
        }); //animazione e icremento del punteggio nella classifica
      })();
      setawardedbugWrongDate(true);
    }
    if (bugPastDate && !awardedbugPastDate) {
      inc += 20;
      (async () => {
        await shootConfetti();
        await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
          nick: user.email,
        }); //animazione e icremento del punteggio nella classifica
      })();
      setawardedbugPastDate(true);
    }
    if (bugNegativePeople && !awardedbugNegativePeople) {
      inc += 20;
      (async () => {
        await shootConfetti();
        await addPoints("Leaderboard", user.uid, 20, "totalPoints", {
          nick: user.email,
        }); //animazione e icremento del punteggio nella classifica
      })();
      setawardedbugNegativePeople(true);
    }
    if (inc > 0) {
      //animazione
      setScore((s) => s + inc);
    }
  }, [
    bugNoLocation,
    bugNoTitle,
    bugWrongDate,
    bugPastDate,
    bugNegativePeople,
    awardedbugNoLocation,
    awardedbugNoTitle,
    awardedbugWrongDate,
    awardedbugPastDate,
    awardedbugNegativePeople,
    user,
  ]);

  function handleSubmit(e) {
    e.preventDefault();
    addEvent();
  }
  function BackToGame() {
    incrementClicks();
    navigate("/game");
  }
  useEffect(() => {
    sessionStorage.setItem("clicks", JSON.stringify(clicks));
    if (user) {
      (async () => {
        await addUser("EventsLevel", user.uid, {
          totalClicks: clicks,
        });
      })();
    }
  }, [clicks, user]);
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("flag2", true);
    }
  }, [user]);
  return (
    <div className="page-container">
      <div className="top-bar">
        <button className="exit-button" onClick={BackToGame}>
          ⏻ Esci
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
      <h1 onClick={incrementClicks} className="page-title">🎉 Party Planner – Crea la tua Festa! 🎉</h1>

      <form onSubmit={handleSubmit} className="event-form">
        <input
          placeholder="Titolo evento"
          value={title}
          onClick={incrementClicks}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Luogo"
          value={location}
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


    </div>
  );
}
