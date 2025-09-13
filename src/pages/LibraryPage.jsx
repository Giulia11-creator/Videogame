
import "../styles/Library.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";

export default function LibraryPage() {
    const [libri, setLibri] = useState([
        { id: 1, titolo: "Il nome della rosa", autore: "U. Eco", anno: 1980, stato: "libero", descr: "Giallo storico in abbazia." },
        { id: 2, titolo: "1984", autore: "G. Orwell", anno: 1949, stato: "libero", descr: "Distopia sul controllo." },
        { id: 3, titolo: "La coscienza di Zeno", autore: "I. Svevo", anno: 1923, stato: "libero", descr: "Romanzo psicologico." },
        { id: 4, titolo: "Il Signore degli Anelli", autore: "J.R.R. Tolkien", anno: 1954, stato: "libero", descr: "Avventura epica." },
        { id: 5, titolo: "Sapiens", autore: "Y.N. Harari", anno: 2011, stato: "libero", descr: "Breve storia dell'umanità." },
        { id: 6, titolo: "La Divina Commedia", autore: "D. Alighieri", anno: 1320, stato: "libero", descr: "Inferno, Purgatorio, Paradiso." },
    ]);

    const navigate = useNavigate();
    const liberi = libri.filter(l => l.stato === "libero").length;
    const prenotati = libri.reduce((sum, l) => {
        if (l.stato !== "prenotato") return sum;
        return sum + (l.id === 2 ? 2 : 1);
    }, 0);
    const [score, setscore] = useState(() => {
        const saved = sessionStorage.getItem("score");
        return saved ? JSON.parse(saved) : 0;
    });

    const [bugWrongBooked, setbugWrongBooked] = useState(() => {
        const saved = sessionStorage.getItem("bugWrongBooked");
        return saved ? JSON.parse(saved) : false;
    });

    const [awardedbugWrongBooked, setawardedbugWrongBooked] = useState(() => {
        const saved = sessionStorage.getItem("awardedbugWrongBooked");
        return saved ? JSON.parse(saved) : false;
    });
    const { user } = UserAuth();

    function BackToGame(){
        navigate("/game");
    }


    function saveBook(book) {
        let books = JSON.parse(sessionStorage.getItem("books") || "[]");
        if (!books.some(b => b.id === book.id)) {
            // salva solo quello che ti serve
            books.push({ id: book.id, titolo: book.titolo, autore: book.autore, anno: book.anno });
            sessionStorage.setItem("books", JSON.stringify(books));

        }
    }

    function removeBook(id) {
        let books = JSON.parse(sessionStorage.getItem("books") || "[]");
        books = books.filter(b => b.id !== id);
        sessionStorage.setItem("books", JSON.stringify(books));
    }

    function handlePrenotaClick(book) {
        const isLibero = book.stato === "libero";
        if (isLibero) saveBook(book);
        else removeBook(book.id);
        setLibri(prev =>
            prev.map(b =>
                b.id === book.id
                    ? { ...b, stato: isLibero ? "prenotato" : "libero" }
                    : b
            )
        );

    }

    function handleClickBooked() {
        let books = JSON.parse(sessionStorage.getItem("books") || "[]");
        if (prenotati > books.length)
            setbugWrongBooked(true);
    }

    useEffect(() => {
        // esci se non è stato rilevato il bug
        if (!bugWrongBooked) return;


        const alreadyAwarded = sessionStorage.getItem("awardedbugWrongBooked") === "true";
        if (alreadyAwarded) return;


        if (!user?.uid || !user?.email) return;

        (async () => {
            await shootConfetti();
            await addPoints("Leaderboard", user.uid, 25, "totalPoints", { nick: user.email });

            setscore((prev) => {
                const next = prev + 25;
                sessionStorage.setItem("score", JSON.stringify(next));
                sessionStorage.setItem("awardedbugWrongBooked", "true");
                return next;
            });
        })();
    }, [bugWrongBooked, user]);


    useEffect(() => {
        if (user) {
            (async () => {
                await addUser("BookLevel", user.uid, {
                    score,
                    email: user.email,
                });
            })();
        }
    }, [score, user]);





    return (
        <div>

            <div className="container with-top-right">
                <div className="topbar">
                    <button className="btn-exit" onClick={BackToGame}>Esci</button>

                    {/* Lato destro: Checkout + Punteggio */}
                    <div className="topbar-right">
                        <button className="btn-checkout">Checkout</button>
                        <div className="score-chip" aria-live="polite" title="Punteggio">
                            <span className="score-label">Punteggio</span>
                            <span className="score-value">{score}</span>
                        </div>
                    </div>
                </div>

                <h1 className="hero-title">📚🐭 Topi da Biblioteca ✨</h1>


                <div className="meta" style={{ marginBottom: 16 }}>
                    Totale: <b style={{ marginLeft: 4, marginRight: 12 }}>{libri.length}</b>
                    Libri liberi: <b style={{ marginLeft: 4, marginRight: 12 }}>{liberi}</b>
                    Prenotati: <b onClick={handleClickBooked} style={{ marginLeft: 4 }}>{prenotati}</b>
                </div>


                <div className="cards">
                    {libri.map((libro) => {
                        const libero = libro.stato === "libero";
                        return (
                            <div key={libro.id} className="card">
                                <div className="card-body">
                                    <div className="title-row">
                                        <div className="title">{libro.titolo}</div>
                                        <span className={`pill ${libero ? "" : ""}`}>{libro.stato.toUpperCase()}</span>
                                    </div>
                                    <div className="meta">{libro.autore} · {libro.anno}</div>
                                    <p className="desc">{libro.descr}</p>
                                    <button
                                        type="button"
                                        className="btn-book"
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
        </div>
    );
}