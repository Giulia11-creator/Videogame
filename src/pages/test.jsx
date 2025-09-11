import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import "../styles/Event.css"; // importa lo stile

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
  const [awardedbugNoTitle, setawardedbugNoTitle] = useState(false);
  const [awardedbugNoLocation, setawardedbugNoLocation] = useState(false);
  const [awardedbugWrongDate, setawardedbugWrongDate] = useState(false);
  const [awardedbugPastDate, setawardedbugPastDate] = useState(false);
  const { user } = UserAuth();

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

  useEffect(() => {
    if (user?.uid != null) {
      addUser();
    }
  }, [score, user?.uid]);

  function addEvent() {
    const newEvent = {
      title,
      location,
      eventDate: dateEvent,
      eventParticipants: participants,
    };
    if ((events.length + 1) % 3 === 0 && events.length > 0) {
      const addDays = Math.floor(Math.random() * 30) + 1;
      const wrongDate = new Date();
      wrongDate.setDate(wrongDate.getDate() + addDays);
      newEvent.eventDate = wrongDate;
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

  useEffect(() => {
    let inc = 0;
    if (bugNoLocation && !awardedbugNoLocation) {
      inc += 33;
      setawardedbugNoLocation(true);
    }
    if (bugNoTitle && !awardedbugNoTitle) {
      inc += 33;
      setawardedbugNoTitle(true);
    }
    if (bugWrongDate && !awardedbugWrongDate) {
      inc += 33;
      setawardedbugWrongDate(true);
    }
    if (bugPastDate && !awardedbugPastDate) {
      inc += 33;
      setawardedbugPastDate(true);
    }
    if (inc > 0) setScore((s) => s + inc);
  }, [bugNoLocation, bugNoTitle, bugWrongDate, bugPastDate]);

  function handleSubmit(e) {
    e.preventDefault();
    addEvent();
  }

  return (
    <div className="page-container">
      <div className="top-bar">
        <button className="exit-button">⏻ Esci</button>
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
            <p><strong>Data:</strong> {ev.eventDate.toLocaleString()}</p>
            <p><strong>Partecipanti:</strong> {ev.eventParticipants}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
