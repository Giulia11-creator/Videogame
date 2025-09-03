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
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  function BackToTravels() {
    sessionStorage.setItem("hotels", JSON.stringify([]));
    navigate('/travel');
  }

  return (<div className="checkout">
    <header className="head">
      <h1>Checkout</h1>
    </header>

    <div className="wrap">
      <main className="main">

        <section className="card mobile-only">
          <div className
            ="hotel">
            <div className
              ="hotel-info">
              <h2 className
                ="hotel-name">{hotel[0]?.hotel}</h2>

            </div>
          </div>
          <div className="stay">
            <div>
              <span>Check-in</span>
              <strong>{hotel[0]?.date1 || today.toLocaleDateString()}</strong>
            </div>
            <div>
              <span>Check-out</span>
              <strong>{hotel[0]?.date2 || tomorrow.toLocaleDateString()}</strong>
            </div>
            <div>
              <span>Ospiti</span>
              <strong>{hotel[0]?.adults || 1} adulti • 1 camera</strong>
            </div>
            <div>
              <span>Prezzo </span>
              <strong>{hotel[0]?.price}</strong>
            </div>
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
          <button className
            ="btn" onClick={BackToTravels}>Paga</button>
          <p className
            ="mini">Cancellazione gratuita fino a 48h prima (esempio).</p>
        </section>
      </main>
    </div>
  </div>
  );
}
export default CheckoutPage;