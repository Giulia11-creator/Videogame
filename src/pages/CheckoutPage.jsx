import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";
import { useRef } from "react";
import "../styles/checkout.css";

const CheckoutPage = () => {

  const storedhotel = sessionStorage.getItem('hotels');
  const hotel = storedhotel ? JSON.parse(storedhotel) : [];
  const navigate =useNavigate();
  function BackToTravels(){
        sessionStorage.setItem("hotels", JSON.stringify([]));
        navigate('/travel');
  }

  return (<div className="checkout">
    <header classNam="head">
      <h1>Checkout</h1>
      <span className="secure">Pagamento sicuro</span>
    </header>

    <div classNam="wrap">
      <main className="main">

        <section className="card mobile-only">
          <div className
            ="hotel">
            <div className
              ="thumb">HOTEL • COVER</div>
            <div className
              ="hotel-info">
              <h2 className
                ="hotel-name">{hotel[0].hotel}</h2>
              <div className
                ="perk-list">
                <span className
                  ="perk">50 m dal mare</span>
                <span className
                  ="perk">Colazione inclusa</span>
                <span className
                  ="perk">Wi-Fi</span>
              </div>
            </div>
          </div>
          <div className
            ="stay">
            <div><span>Check-in</span><strong>12/09/2025</strong></div>
            <div><span>Check-out</span><strong>15/09/2025</strong></div>
            <div><span>Pernotti</span><strong>3</strong></div>
            <div><span>Ospiti</span><strong>2 adulti • 1 camera</strong></div>
          </div>
          <div className
            ="total-box">
            <div className
              ="row"><span>{hotel[0].price} × 3 notti</span><span>{(Number(hotel[0].price)*3)}</span></div>
            <div className
              ="row"><span>Tasse (10%)</span><span>€38,70</span></div>
            <div className
              ="row total"><span>Totale</span><strong>€425,70</strong></div>
          </div>
        </section>


        <section className
          ="card">
          <h3>Dati ospite</h3>
          <div className
            ="grid2">
            <label className
              ="field">
              <span>Nome*</span>
              <input type="text" placeholder="Mario" />
            </label>
            <label className
              ="field">
              <span>Cognome*</span>
              <input type="text" placeholder="Rossi" />
            </label>
          </div>
          <div className
            ="grid2">
            <label className
              ="field">
              <span>Email*</span>
              <input type="email" placeholder="mario.rossi@email.com" />
            </label>
            <label className
              ="field">
              <span>Telefono</span>
              <input type="text" placeholder="+39 ..." />
            </label>
          </div>
          <label className
            ="field">
            <span>Richieste (opz.)</span>
            <input type="text" placeholder="Es. check-in tardivo" />
          </label>
        </section>


        <section className
          ="card">
          <h3>Pagamento</h3>
          <label className
            ="field">
            <span>Numero carta</span>
            <input type="text" placeholder="1234 5678 9012 3456" />
          </label>
          <div className
            ="grid3">
            <label className
              ="field">
              <span>Nome sulla carta</span>
              <input type="text" placeholder="MARIO ROSSI" />
            </label>
            <label className
              ="field">
              <span>Scadenza</span>
              <input type="text" placeholder="MM/AA" />
            </label>
            <label className
              ="field">
              <span>CVV</span>
              <input type="text" placeholder="123" />
            </label>
          </div>

          <div className
            ="grid2">
            <label className
              ="field">
              <span>Codice promo (opz.)</span>
              <input type="text" placeholder="ESTATE10" />
            </label>
            <div className
              ="hint">Se valido, lo sconto verrà applicato al totale.</div>
          </div>

          <label className
            ="check">
            <input type="checkbox" />
            <span>Accetto termini e privacy.</span>
          </label>

          <button className
            ="btn" onClick={BackToTravels}>Paga €425,70 </button>
          <p className
            ="mini">Cancellazione gratuita fino a 48h prima (esempio).</p>
        </section>
      </main>

      <aside className="side card desktop-only">
        <div className
          ="hotel">
          <div className
            ="thumb">HOTEL • COVER</div>
          <div className
            ="hotel-info">
            <h2 className
              ="hotel-name">Hotel Mare Azzurro</h2>
            <div className
              ="perk-list">
              <span className
                ="perk">50 m dal mare</span>
              <span className
                ="perk">Colazione inclusa</span>
              <span className
                ="perk">Wi-Fi</span>
            </div>
          </div>
        </div>

        <div className
          ="stay">
          <div><span>Check-in</span><strong>12/09/2025</strong></div>
          <div><span>Check-out</span><strong>15/09/2025</strong></div>
          <div><span>Pernotti</span><strong>3</strong></div>
          <div><span>Ospiti</span><strong>2 adulti • 1 camera</strong></div>
        </div>

        <hr />

        <div className
          ="total-box">
          <div className
            ="row"><span>€129 × 3 notti</span><span>€387,00</span></div>
          <div className
            ="row"><span>Tasse (10%)</span><span>€38,70</span></div>
          <div className
            ="row total"><span>Totale</span><strong>€425,70</strong></div>
        </div>

        <ul className
          ="bullets">
          <li>Cancellazione gratuita</li>
          <li>Conferma via email</li>
          <li>Wi-Fi incluso</li>
        </ul>
      </aside>
    </div>
  </div>
  );
}
export default CheckoutPage;