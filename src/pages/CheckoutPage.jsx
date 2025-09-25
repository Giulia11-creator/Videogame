import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { shootConfetti } from "../ReactComponents/confetti.jsx";
import { addUser, addPoints } from "../ReactComponents/FirestoreFunction.js";
import "../styles/checkout.css";
import LevelCompleted from "../ReactComponents/LevelCompleted.jsx";

const CheckoutPage = () => {
  const storedhotel = sessionStorage.getItem("hotels");
  const [hotel, setHotel] = useState(
    storedhotel ? JSON.parse(storedhotel) : []
  );
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [coupon, setcoupon] = useState("");
  const { user } = UserAuth();
  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem("score");
    return saved ? JSON.parse(saved) : 0;
  });
  const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });

  const [bugCoupon, setBugCoupon] = useState(() => {
    const saved = sessionStorage.getItem("bugCoupon");
    return saved ? JSON.parse(saved) : false;
  });

  const [modal, setModalVisible] = useState(false);

    function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      sessionStorage.setItem("clicks", JSON.stringify(next));
      return next; // importante restituire il nuovo valore
    });
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


  useEffect(() => {
    if (score === 100) {
      
    setModalVisible(true);
    }
  }, [score]);

  function BackToTravels() {
    incrementClicks();
    sessionStorage.setItem("hotels", JSON.stringify([]));
    navigate("/travel");
  }

  useEffect(() => {
    if (!bugCoupon) return;

    const alreadySet = sessionStorage.getItem("scoreSetForCoupon");
    if (alreadySet) return;

    (async () => {
      await shootConfetti();
      await addPoints("Leaderboard", user.uid, 25, "totalPoints", {
        nick: user.email,
      });
      setscore((prev) => {
        const next = prev + 25; // calcolo dal valore corrente
        sessionStorage.setItem("score", JSON.stringify(next));
        sessionStorage.setItem("scoreSetForCoupon", "true");
        return next;
      });
    })();
  }, [bugCoupon, user.uid, user.email]);

  useEffect(() => {
    if (coupon !== "") {
      if (coupon !== "ESTATE10") {
        setBugCoupon(true);
      }
      setHotel((prev) => {
        if (prev.length === 0) return prev; // niente hotel
        const updated = [...prev];
        updated[0] = { ...updated[0], price: "Sconto: € 50 / notte" };
        return updated;
      });
    }
  }, [coupon]);

  useEffect(() => {
    sessionStorage.setItem("score", JSON.stringify(score));
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

  return (
    <div className="checkout">
      <header className="head">
        <h1>Checkout</h1>
      </header>

      <div className="wrap">
        <main className="main">
          <section className="card mobile-only">
            <div className="hotel">
              <div className="hotel-info">
                <h2  onClick={incrementClicks} className="hotel-name">{hotel[0]?.hotel}</h2>
              </div>
            </div>
            <div className="stay">
              <div>
                <span  onClick={incrementClicks}>Check-in</span>
                <strong  onClick={incrementClicks}>{hotel[0]?.date1 || today.toLocaleDateString()}</strong>
              </div>
              <div>
                <span>Check-out</span>
                <strong  onClick={incrementClicks}>
                  {hotel[0]?.date2 || tomorrow.toLocaleDateString()}
                </strong>
              </div>
              <div>
                <span  onClick={incrementClicks}>Ospiti</span>
                <strong  onClick={incrementClicks}>{hotel[0]?.adults || 1} adulti • 1 camera</strong>
                <strong  onClick={incrementClicks}>{hotel[0]?.children || 0} bambini • 1 camera</strong>
              </div>
              <div>
                <span  onClick={incrementClicks}>Prezzo </span>
                <strong  onClick={incrementClicks}>{hotel[0]?.price}</strong>
              </div>
            </div>
          </section>

          <section className="card">
            <h3  onClick={incrementClicks}>Dati ospite</h3>
            <div className="grid2">
              <label className="field">
                <span  onClick={incrementClicks}>Nome*</span>
                <input type="text" placeholder="Mario"  onClick={incrementClicks} />
              </label>
              <label className="field">
                <span  onClick={incrementClicks}>Cognome*</span>
                <input type="text" placeholder="Rossi" onClick={incrementClicks}/>
              </label>
            </div>
            <div className="grid2">
              <label className="field">
                <span  onClick={incrementClicks}>Email*</span>
                <input type="email" placeholder="mario.rossi@email.com"  onClick={incrementClicks} />
              </label>
              <label className="field">
                <span  onClick={incrementClicks}>Telefono</span>
                <input type="text" placeholder="+39 ..."  onClick={incrementClicks}/>
              </label>
            </div>
            <label className="field">
              <span  onClick={incrementClicks}>Richieste (opz.)</span>
              <input type="text" placeholder="Es. check-in tardivo"  onClick={incrementClicks} />
            </label>
          </section>

          <section className="card">
            <h3  onClick={incrementClicks}>Pagamento</h3>
            <label className="field">
              <span  onClick={incrementClicks}>Numero carta</span>
              <input type="text" placeholder="1234 5678 9012 3456"  onClick={incrementClicks} />
            </label>
            <div className="grid3">
              <label className="field">
                <span  onClick={incrementClicks}>Nome sulla carta</span>
                <input type="text" placeholder="MARIO ROSSI"  onClick={incrementClicks} />
              </label>
              <label className="field">
                <span  onClick={incrementClicks}>Scadenza</span>
                <input type="text" placeholder="MM/AA"  onClick={incrementClicks} />
              </label>
              <label className="field">
                <span  onClick={incrementClicks}>CVV</span>
                <input type="text" placeholder="123"  onClick={incrementClicks}/>
              </label>
            </div>

            <div className="grid2">
              <label className="field">
                <span  onClick={incrementClicks}>Codice promo (opz.)</span>
                <input
                  onChange={(e) => setcoupon(e.target.value)}
                   onClick={incrementClicks}
                  type="text"
                  placeholder="ESTATE10"
                />
              </label>
              <div  onClick={incrementClicks} className="hint">
                Se valido, lo sconto verrà applicato al totale.
              </div>
            </div>
            <button className="btn" onClick={BackToTravels}>
              Paga
            </button>
            <p className="mini"  onClick={incrementClicks}>
              Cancellazione gratuita fino a 48h prima (esempio).
            </p>
          </section>
        </main>
      </div>
        {modal && (
              <div>
                <LevelCompleted />
              </div>
            )}
    </div>
    
  );
};
export default CheckoutPage;
