import React, { useEffect, useState } from "react";
import { doc, setDoc, updateDoc, getDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import "../styles/Event.css"; // importa lo stile
import confetti from "canvas-confetti";
import { useNavigate } from 'react-router-dom';
export default function EventFormBug() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState(0);
  const [msg, setMsg] = useState("");
  const [score, setScore] = useState(0);
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
  const [awardedbugNegativePeople, setawardedbugNegativePeople] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate()

  async function addUser() {
    if (!user?.uid) return;
    const userRef = doc(db, "EventsLevel", user.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        await setDoc(userRef, { points: Number(score) }, { merge: true });
      } else {
        await setDoc(userRef, {
          id: user.uid,
          nick: user.email,
          points: Number(score),
        });
      }
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  }

  async function addPoints(delta) {
    const ref = doc(db, "Leaderboard", user.uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      await updateDoc(ref, {
        totalPoints: increment(delta),
      })
    }
    else {
      await setDoc(ref, {
        id: user.uid,
        nick: user.email,
        totalPoints: increment(delta),
      });

    }
  }

  useEffect(() => {
    if (user?.uid != null) {
      addUser();
    }
  }, [score, user?.uid]);

  // Anima i coriandoli per ~1.2s
  function shootConfetti(duration = 1200) {
    return new Promise((resolve) => {
      const end = Date.now() + duration;

      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 } });
        confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 } });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      })();
    });
  }


  function addEvent() {
    const newEvent = {
      title,
      location,
      eventDate: dateEvent,
      eventParticipants: participants,
      backupDate: dateEvent,
    };
    if ((events.length + 1) % 3 === 0 && events.length > 0) {
      const addDays = Math.floor(Math.random() * 30) + 1;
      const wrongDate = new Date();
      wrongDate.setDate(wrongDate.getDate() + addDays);
      newEvent.eventDate = wrongDate.toISOString().split("T")[0];
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
    const dateBackup = event.backupDate;
    if (event.eventDate != dateBackup) {
      setbugWrongDate(true);
    }
  }

  const CheckParticipants = (event) => {
    if (event.eventParticipants < 0) {
      setbugNegativePeople(true);
    }
  }
  useEffect(() => {
    let inc = 0;
    if (bugNoLocation && !awardedbugNoLocation) {
      inc += 20;
      addPoints(20);
      setawardedbugNoLocation(true);
    }
    if (bugNoTitle && !awardedbugNoTitle) {
      inc += 20;
      addPoints(20);
      setawardedbugNoTitle(true);
    }
    if (bugWrongDate && !awardedbugWrongDate) {
      inc += 20;
      addPoints(20);
      setawardedbugWrongDate(true);
    }
    if (bugPastDate && !awardedbugPastDate) {
      inc += 20;
      addPoints(20);
      setawardedbugPastDate(true);
    }
    if (bugNegativePeople && !awardedbugNegativePeople) {
      inc += 20;
      addPoints(20);
      setawardedbugNegativePeople(true);
    }
    if (inc > 0) {
      (async () => {
        await shootConfetti(1200);         //animazione
        setScore((s) => s + inc);
      })();
    }
  }, [bugNoLocation, bugNoTitle, bugWrongDate, bugPastDate, bugNegativePeople]);

  function handleSubmit(e) {
    e.preventDefault();
    addEvent();
  }
  function BackToGame() {
    navigate('/game');
  }
  return (
    <div className="page-container">
      <div className="top-bar">
        <button className="exit-button" onClick={BackToGame}>⏻ Esci</button>
        <div className="score-display">
          <strong>Punteggio:</strong> {score}
        </div>
      </div>
      <h1 className="page-title">🎉 Party Planner – Crea la tua Festa! 🎉</h1>

      <form onSubmit={handleSubmit} className="event-form">
        <input
          placeholder="Titolo evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Luogo"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Numero partecipanti"
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
        />
        <label className="field">
          <span>Data evento</span>
          <input id="DIn" type="date" onChange={(e) => setdateEvent(e.target.value)} />
        </label>
        <button type="submit">➕ Crea evento</button>
      </form>

      <p className="message">{msg}</p>

      <div className="events-grid">
        {events.map((ev, i) => (
          <div key={i} className="event-card">
            <h4>{ev.title}</h4>
            <p><strong>Luogo:</strong> {ev.location}</p>
            <p onClick={() => ClickDate(ev)}><strong>Data:</strong> {ev.eventDate.toLocaleString()}</p>
            <p onClick={() => CheckParticipants(ev)}><strong>Partecipanti:</strong> {ev.eventParticipants}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
