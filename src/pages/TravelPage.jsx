import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";
import "../styles/travel.css";
import h1 from "../images/h1.jpg";
import h2 from "../images/h2.jpg";
import h3 from "../images//h3.jpg";
import h4 from "../images/h4.jpg";
import LevelCompleted from "../ReactComponents/LevelCompleted.jsx";


const TravelPage = () => {
  const navigate = useNavigate();
  // const [errorMessage, seterrorMessage] = useState("");
  const [modal, setModalVisible] = useState(false);
  // const [popVisible, setpopVisible] = useState(false);
  const [nAdults, setnAdults] = useState(0);
  const [nchildren, setnchildren] = useState(0);
  const [dateIn, setDateIn] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [bugNegativePeople, setbugNegativePeople] = useState(() => {
    const saved = sessionStorage.getItem("bugNegativePeople");
    return saved ? JSON.parse(saved) : false;
  });
  const [bugNegativeChildren, setbugNegativeChildren] = useState(() => {
    const saved = sessionStorage.getItem("bugNegativeChildren");
    return saved ? JSON.parse(saved) : false;
  });

  const [bugDate1, setbugDate1] = useState(() => {
    const saved = sessionStorage.getItem("bugDate1");
    return saved ? JSON.parse(saved) : false;
  });
  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem("score");
    return saved ? JSON.parse(saved) : 0;
  });

  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });

  const { user } = UserAuth();

  function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      sessionStorage.setItem("clicks", JSON.stringify(next));
      return next; // importante restituire il nuovo valore
    });
  }

  useEffect(() => {
    const dIn = new Date(dateIn);
    const dOut = new Date(dateOut);
    if (dIn > dOut) setbugDate1(true);
  }, [dateIn, dateOut]);

  useEffect(() => {
    if (bugDate1) {
      const scoreSetForWrongDate1 = sessionStorage.getItem(
        "scoreSetForWrongDate1"
      );
      if (!scoreSetForWrongDate1) {
        (async () => {
          await shootConfetti();
          await addPoints("Leaderboard", user.uid, 25, "totalPoints", {
            nick: user.email,
          }); //animazione
          setscore((prev) => {
            const next = prev + 25;
            sessionStorage.setItem("score", JSON.stringify(next));
            sessionStorage.setItem("scoreSetForWrongDate1", "true");
            return next;
          });
        })();
      }
    }
  }, [bugDate1, user.uid, user.email]);

  useEffect(() => {
    if (bugNegativePeople) {
      const scoreSetForbugNegativePeople = sessionStorage.getItem(
        "scoreSetForbugNegativePeople"
      );
      if (!scoreSetForbugNegativePeople) {
        (async () => {
          await shootConfetti();
          await addPoints("Leaderboard", user.uid, 25, "totalPoints", {
            nick: user.email,
          }); //animazione
          setscore((prev) => {
            const next = prev + 25;
            sessionStorage.setItem("score", JSON.stringify(next));
            sessionStorage.setItem("scoreSetForbugNegativePeople", "true");
            return next;
          });
        })();
      }
    }
  }, [bugNegativePeople, user.uid, user.email]);

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
      const scoreSetForbugNegativeChildren = sessionStorage.getItem(
        "scoreSetForbugNegativeChildren"
      );
      if (!scoreSetForbugNegativeChildren) {
        (async () => {
          await shootConfetti();
          await addPoints("Leaderboard", user.uid, 25, "totalPoints", {
            nick: user.email,
          }); //animazione
          setscore((prev) => {
            const next = prev + 25;
            sessionStorage.setItem("score", JSON.stringify(next));
            sessionStorage.setItem("scoreSetForbugNegativeChildren", "true");
            return next;
          });
        })();
      }
    }
  }, [bugNegativeChildren, user.uid, user.email]);
  // Quando lo score cambia, salvo sempre in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("score", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    if (score == 100) {
      setModalVisible(true);
    }
  }, [score]);

  useEffect(() => {
    sessionStorage.setItem("clicks", JSON.stringify(clicks));
    if (user) {
      (async () => {
        await addUser("TravelLevel", user.uid, {
          totalClicks: clicks,
        });
      })();
    }
  }, [clicks, user]);

  function BackToGame() {
    incrementClicks();
    navigate("/game");
  }

  function saveData(price, name) {
    incrementClicks();
    const hotel = {
      hotel: document.getElementById(name).textContent,
      price: document.getElementById(price).textContent,
      adults: nAdults,
      children: nchildren,
      date1: dateIn,
      date2: dateOut,
    };

    let hotels = sessionStorage.getItem("hotels");
    hotels = hotels ? JSON.parse(hotels) : [];

    hotels.push(hotel);

    sessionStorage.setItem("hotels", JSON.stringify(hotels));

    console.log("saved hotel");

    navigate("/checkout");
  }

  useEffect(() => {
    if (user) {
      (async () => {
        await addUser("TravelLevel", user.uid, {
          score,
          email: user.email,
        });
      })();
    }
  }, [score, user]);

  const closeModal = () => {
    setModalVisible(false);
    navigate("/game");
  };

  return (
    <div className="container">
      <div className="topbar">
        <button className="btn-exit" onClick={BackToGame}>
          Esci
        </button>

        <div className="score-chip" aria-live="polite" title="Punteggio">
          <span onClick={incrementClicks} className="score-label">Punteggio</span>
          <span onClick={incrementClicks} className="score-value">{score}</span>
        </div>
      </div>

      <header className="header">
        <h1 className="page-title" onClick={incrementClicks}>Trova e prenota il tuo soggiorno✈️🏨</h1>
      </header>

      <section
        className="search-panel"
        role="search"
        aria-label="Filtri di ricerca"
      >
        <form className="form-grid">
          <label className="field">
            <span>Check-in</span>
            <input
              id="DIn"
              type="date"
              onChange={(e) => setDateIn(e.target.value)}
              onClick={incrementClicks}
            />
          </label>
          <label className="field">
            <span>Check-out</span>
            <input
              id="DOut"
              type="date"
              onChange={(e) => setDateOut(e.target.value)}
              onClick={incrementClicks}
            />
          </label>
          <label className="field">
            <span>Adulti</span>
            <input
              id="adults"
              type="number"
              onChange={(e) => setnAdults(Number(e.target.value))}
              onClick={incrementClicks}
            />
          </label>
          <label className="field">
            <span>Bambini</span>
            <input
              id="children"
              type="number"
              onChange={(e) => setnchildren(Number(e.target.value))}
              onClick={incrementClicks}
            />
          </label>
        </form>
      </section>

      <section aria-label="Risultati hotel">
        <div className="cards">
          <article className="card">
            <div className="media">
              <img src={h1} onClick={incrementClicks} />
            </div>
            <div className="card-body">
              <div className="title-row">
                <h2 className="title" onClick={incrementClicks} id="MareAzzurro">
                  Hotel Mare Azzurro
                </h2>
                <div className="stars" onClick={incrementClicks}>★★★★☆</div>
              </div>
              <div className="meta">
                <span className="pill" onClick={incrementClicks}>50 m dal mare</span>
                <span className="pill" onClick={incrementClicks}>Colazione inclusa</span>
                <span className="pill" onClick={incrementClicks}>Wi‑Fi</span>
              </div>
              <div className="price-row">
                <div>
                  <div className="price" id="priceMa">
                    € 129<span className="small" onClick={incrementClicks}> / notte</span>
                  </div>
                  <div className="small" onClick={incrementClicks}>Cancellazione gratuita</div>
                </div>
                <div className="cta">
                  <button
                    className="btn-buy"
                    onClick={() => saveData("priceMa", "MareAzzurro")}
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="card">
            <div className="media">
              <img src={h2} onClick={incrementClicks} />
            </div>
            <div className="card-body">
              <div className="title-row">
                <h2 className="title" onClick={incrementClicks} id="Boutique Centro Storico">
                  Boutique Centro Storico
                </h2>
                <div className="stars" onClick={incrementClicks}>★★★★★</div>
              </div>
              <div className="meta">
                <span onClick={incrementClicks} className="pill">Centro città</span>
                <span onClick={incrementClicks} className="pill">Spa &amp; Gym</span>
                <span onClick={incrementClicks} className="pill">Pet‑friendly</span>
              </div>
              <div className="price-row">
                <div>
                  <div className="price" id="priceB">
                    € 189<span onClick={incrementClicks} className="small"> / notte</span>
                  </div>
                  <div className="small" onClick={incrementClicks}>Pagamento in struttura</div>
                </div>
                <div className="cta">
                  <button
                    className="btn-buy"
                    onClick={() =>
                      saveData("priceB", "Boutique Centro Storico")
                    }
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="card">
            <div className="media">
              <img src={h3} onClick={incrementClicks} />
            </div>
            <div className="card-body">
              <div className="title-row">
                <h2 className="title" onClick={incrementClicks} id="Eco Lodge Collina">
                  Eco Lodge Collina
                </h2>
                <div className="stars" onClick={incrementClicks}>★★★★☆</div>
              </div>
              <div className="meta">
                <span className="pill" onClick={incrementClicks}>Parcheggio gratuito</span>
                <span className="pill" onClick={incrementClicks}>Ristorante</span>
                <span className="pill" onClick={incrementClicks}>Vicino a sentieri</span>
              </div>
              <div className="price-row">
                <div>
                  <div className="price" id="priceEco">
                    € 99<span onClick={incrementClicks} className="small"> / notte</span>
                  </div>
                  <div className="small" onClick={incrementClicks}>Offerta limitata</div>
                </div>
                <div className="cta">
                  <button
                    className="btn-buy"
                    onClick={() => saveData("priceEco", "Eco Lodge Collina")}
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="card">
            <div className="media">
              <img src={h4} onClick={incrementClicks} />
            </div>
            <div className="card-body">
              <div className="title-row">
                <h2 className="title" onClick={incrementClicks} id="Resort Lago Sereno">
                  Resort Lago Sereno
                </h2>
                <div className="stars" onClick={incrementClicks}>★★★★☆</div>
              </div>
              <div className="meta">
                <span className="pill" onClick={incrementClicks}>Vista lago</span>
                <span className="pill" onClick={incrementClicks}>Piscina</span>
                <span className="pill" onClick={incrementClicks}>Colazione inclusa</span>
              </div>
              <div className="price-row">
                <div>
                  <div className="price" id="pricer">
                    € 149<span className="small" onClick={incrementClicks}> / notte</span>
                  </div>
                  <div className="small" onClick={incrementClicks}>Cancellazione gratuita</div>
                </div>
                <div className="cta">
                  <button
                    className="btn-buy"
                    onClick={() => saveData("pricer", "Resort Lago Sereno")}
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {modal && (
        <div>
          <LevelCompleted />
        </div>
      )}
    </div>
  );
};

export default TravelPage;
