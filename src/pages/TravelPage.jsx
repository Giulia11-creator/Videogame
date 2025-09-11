import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp, documentId } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import "../styles/travel.css";
import h1 from "/public/h1.jpg";
import h2 from "/public/h2.jpg";
import h3 from "/public/h3.jpg";
import h4 from "/public/h4.jpg";


const TravelPage = () => {
    const navigate = useNavigate();
    const [errorMessage, seterrorMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [popVisible, setpopVisible] = useState(false);
    const [nAdults, setnAdults] = useState(0);
    const [nchildren, setnchildren] = useState(0);
    const [dateIn, setDateIn] = useState("");
    const [dateOut, setDateOut] = useState("");
    const [bugNegativePeople, setbugNegativePeople] = useState(() => {
        const saved = sessionStorage.getItem('bugNegativePeople');
        return saved ? JSON.parse(saved) : false;
    });
    const [bugNegativeChildren, setbugNegativeChildren] = useState(() => {
        const saved = sessionStorage.getItem('bugNegativeChildren');
        return saved ? JSON.parse(saved) : false;
    });
    const [bugCoupon, setbugCoupon] = useState(() => {
        const saved = sessionStorage.getItem('bugCoupon');
        return saved ? JSON.parse(saved) : false;
    });

    const [bugDate1, setbugDate1] = useState(() => {
        const saved = sessionStorage.getItem('bugDate1');
        return saved ? JSON.parse(saved) : false;
    });
    const [score, setscore] = useState(() => {
        const saved = sessionStorage.getItem('score');
        return saved ? JSON.parse(saved) : 0;
    });

    const { user } = UserAuth();


    // Anima i coriandoli per ~1.2s, ritorna una Promise che si risolve a fine animazione
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


    useEffect(() => {
        const dIn = new Date(dateIn);
        const dOut = new Date(dateOut);
        if (dIn > dOut)
            setbugDate1(true);
    }, [dateIn, dateOut]);

    useEffect(() => {
        if (bugDate1) {
            const scoreSetForWrongDate1 = sessionStorage.getItem('scoreSetForWrongDate1');
            if (!scoreSetForWrongDate1) {
                const newScore = score + 33;
                (async () => {
                    await shootConfetti(1200);         //animazione
                    setscore(newScore);
                })();
                sessionStorage.setItem('score', JSON.stringify(newScore));
                sessionStorage.setItem('scoreSetForWrongDate1', 'true');
            }
        }

    }, [bugDate1]);


    useEffect(() => {
        if (bugNegativePeople) {
            const scoreSetForbugNegativePeople = sessionStorage.getItem('scoreSetForbugNegativePeople');
            if (!scoreSetForbugNegativePeople) {
                const newScore = score + 33; // il valore che vuoi settare
                (async () => {
                    await shootConfetti(1200);         //animazione
                    setscore(newScore);
                })();
                sessionStorage.setItem('score', JSON.stringify(newScore));
                sessionStorage.setItem('scoreSetForbugNegativePeople', 'true');
            }

        }
    }, [bugNegativePeople]);


    useEffect(() => {
        if (nAdults <= -1) {
            setbugNegativePeople(true);

        }
    }, [nAdults]);

    useEffect(() => {
        if (nchildren <= -1) {
            setbugNegativeChildren(true);
        }
    }, [nchildren]);


    useEffect(() => {
        if (bugNegativeChildren) {
            const scoreSetForbugNegativeChildren = sessionStorage.getItem('scoreSetForbugNegativeChildren');
            if (!scoreSetForbugNegativeChildren) {
                const newScore = score + 33; // il valore che vuoi settare
                (async () => {
                    await shootConfetti(1200);         //animazione
                    setscore(newScore);
                })();
                sessionStorage.setItem('score', JSON.stringify(newScore));
                sessionStorage.setItem('scoreSetForbugNegativeChildren', 'true');
            }

        }
    }, [bugNegativeChildren]);
    // Quando lo score cambia, salvo sempre in sessionStorage
    useEffect(() => {
        sessionStorage.setItem('score', JSON.stringify(score));
    }, [score]);

    useEffect(() => {
        if (score == 100) {
            setModalVisible(true);
        }
    }, [score]);

    function BackToGame() {
        navigate('/game');
    }

    function saveData(price, name) {
        const hotel = {

            hotel: document.getElementById(name).textContent,
            price: document.getElementById(price).textContent,
            adults: nAdults,
            children: nchildren,
            date1: dateIn,
            date2: dateOut
        };

        let hotels = sessionStorage.getItem("hotels");
        hotels = hotels ? JSON.parse(hotels) : [];

        hotels.push(hotel);

        sessionStorage.setItem("hotels", JSON.stringify(hotels));

        console.log("saved hotel");

        navigate('/checkout');

    }


    async function addUser() {
        const userRef = doc(db, "TravelLevel", user.uid);
        try {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                await setDoc(
                    userRef,
                    {
                        points: Number(score),
                        lastUpdate: serverTimestamp(),
                    },
                    { merge: true }
                );
                console.log("Utente aggiornato con nuovo score e timestamp.");
            } else {
                await setDoc(userRef, {
                    id: user.uid,
                    nick: user.email,
                    points: Number(score),
                    createdAt: serverTimestamp(),
                    lastUpdate: serverTimestamp(),
                });
                console.log("Nuovo utente creato.");
            }
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }
    }
    useEffect(() => {
        if (user) {
            addUser();
        }
    }, [score, user]);

    const closeModal = () => {
        setModalVisible(false);
        navigate("/game");
    };

    return (
        <div className="container">
            <div className="topbar">
                <button className="btn-exit" onClick={BackToGame}>Esci</button>

                <div className="score-chip" aria-live="polite" title="Punteggio">
                    <span className="score-label">Punteggio</span>
                    <span className="score-value">{score}</span>
                </div>
            </div>


            <header className="header">
                <h1 className="page-title">Trova e prenota il tuo soggiorno✈️🏨</h1>
            </header>

            <section className="search-panel" role="search" aria-label="Filtri di ricerca">
                <form className="form-grid">
                    <label className="field">
                        <span>Check-in</span>
                        <input id="DIn" type="date" onChange={(e) => setDateIn(e.target.value)} />
                    </label>
                    <label className="field">
                        <span>Check-out</span>
                        <input id="DOut" type="date" onChange={(e) => setDateOut(e.target.value)} />
                    </label>
                    <label className="field">
                        <span>Adulti</span>
                        <input id="adults" type="number" onChange={(e) => setnAdults(Number(e.target.value))} />
                    </label>
                    <label className="field">
                        <span>Bambini</span>
                        <input id="children" type="number" onChange={(e) => setnchildren(Number(e.target.value))} />
                    </label>


                </form>
            </section>

            <section aria-label="Risultati hotel">
                <div className="cards">
                    <article className="card">
                        <div className="media"><img src={h1} /></div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title" id="MareAzzurro">Hotel Mare Azzurro</h2>
                                <div className="stars">★★★★☆</div>
                            </div>
                            <div className="meta">
                                <span className="pill">50 m dal mare</span>
                                <span className="pill">Colazione inclusa</span>
                                <span className="pill">Wi‑Fi</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price" id="priceMa">€ 129<span className="small"> / notte</span></div>
                                    <div className="small">Cancellazione gratuita</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy" onClick={() => saveData("priceMa", "MareAzzurro")}>Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="media"><img src={h2} /></div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title" id="Boutique Centro Storico">Boutique Centro Storico</h2>
                                <div className="stars">★★★★★</div>
                            </div>
                            <div className="meta">
                                <span className="pill">Centro città</span>
                                <span className="pill">Spa &amp; Gym</span>
                                <span className="pill">Pet‑friendly</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price" id="priceB">€ 189<span className="small"> / notte</span></div>
                                    <div className="small">Pagamento in struttura</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy" onClick={() => saveData("priceB", "Boutique Centro Storico")}>Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="media"><img src={h3} /></div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title" id="Eco Lodge Collina">Eco Lodge Collina</h2>
                                <div className="stars">★★★★☆</div>
                            </div>
                            <div className="meta">
                                <span className="pill">Parcheggio gratuito</span>
                                <span className="pill">Ristorante</span>
                                <span className="pill">Vicino a sentieri</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price" id="priceEco">€ 99<span className="small"> / notte</span></div>
                                    <div className="small">Offerta limitata</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy" onClick={() => saveData("priceEco", "Eco Lodge Collina")}>Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="media"><img src={h4} /></div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title" id="Resort Lago Sereno">Resort Lago Sereno</h2>
                                <div className="stars">★★★★☆</div>
                            </div>
                            <div className="meta">
                                <span className="pill">Vista lago</span>
                                <span className="pill">Piscina</span>
                                <span className="pill">Colazione inclusa</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price" id="pricer">€ 149<span className="small"> / notte</span></div>
                                    <div className="small">Cancellazione gratuita</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy" onClick={() => saveData("pricer", "Resort Lago Sereno")}>Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {modalVisible && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0, // equivale a top:0, right:0, bottom:0, left:0
                        zIndex: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(75, 85, 99, 0.5)" // grigio con opacità
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            width: "100%",
                            maxWidth: "500px"
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                textAlign: "center",
                                marginBottom: "16px",
                                color: "#9333ea" // viola
                            }}
                        >
                            Ottimo lavoro!
                        </h3>
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: "24px",
                                color: "#374151"
                            }}
                        >
                            Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!
                        </p>
                        <div style={{ textAlign: "center" }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    backgroundColor: "#9333ea",
                                    color: "white",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease"
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#7e22ce")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#9333ea")
                                }
                            >
                                Ok, torna alla Home
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );




};

export default TravelPage;