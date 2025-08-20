import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";
import { useRef } from "react";
import "../styles/checkout.css";

const CheckoutPage = () =>{

    return(<div class="checkout">
  <header class="head">
    <h1>Checkout</h1>
    <span class="secure">Pagamento sicuro</span>
  </header>

  <div class="wrap">
    <main class="main">
     
      <section class="card mobile-only">
        <div class="hotel">
          <div class="thumb">HOTEL • COVER</div>
          <div class="hotel-info">
            <h2 class="hotel-name">Hotel Mare Azzurro</h2>
            <div class="perk-list">
              <span class="perk">50 m dal mare</span>
              <span class="perk">Colazione inclusa</span>
              <span class="perk">Wi-Fi</span>
            </div>
          </div>
        </div>
        <div class="stay">
          <div><span>Check-in</span><strong>12/09/2025</strong></div>
          <div><span>Check-out</span><strong>15/09/2025</strong></div>
          <div><span>Pernotti</span><strong>3</strong></div>
          <div><span>Ospiti</span><strong>2 adulti • 1 camera</strong></div>
        </div>
        <div class="total-box">
          <div class="row"><span>€129 × 3 notti</span><span>€387,00</span></div>
          <div class="row"><span>Tasse (10%)</span><span>€38,70</span></div>
          <div class="row total"><span>Totale</span><strong>€425,70</strong></div>
        </div>
      </section>

 
      <section class="card">
        <h3>Dati ospite</h3>
        <div class="grid2">
          <label class="field">
            <span>Nome*</span>
            <input type="text" placeholder="Mario" />
          </label>
          <label class="field">
            <span>Cognome*</span>
            <input type="text" placeholder="Rossi" />
          </label>
        </div>
        <div class="grid2">
          <label class="field">
            <span>Email*</span>
            <input type="email" placeholder="mario.rossi@email.com" />
          </label>
          <label class="field">
            <span>Telefono</span>
            <input type="text" placeholder="+39 ..." />
          </label>
        </div>
        <label class="field">
          <span>Richieste (opz.)</span>
          <input type="text" placeholder="Es. check-in tardivo" />
        </label>
      </section>

   
      <section class="card">
        <h3>Pagamento</h3>
        <label class="field">
          <span>Numero carta</span>
          <input type="text" placeholder="1234 5678 9012 3456" />
        </label>
        <div class="grid3">
          <label class="field">
            <span>Nome sulla carta</span>
            <input type="text" placeholder="MARIO ROSSI" />
          </label>
          <label class="field">
            <span>Scadenza</span>
            <input type="text" placeholder="MM/AA" />
          </label>
          <label class="field">
            <span>CVV</span>
            <input type="text" placeholder="123" />
          </label>
        </div>

        <div class="grid2">
          <label class="field">
            <span>Codice promo (opz.)</span>
            <input type="text" placeholder="ESTATE10" />
          </label>
          <div class="hint">Se valido, lo sconto verrà applicato al totale.</div>
        </div>

        <label class="check">
          <input type="checkbox" />
          <span>Accetto termini e privacy.</span>
        </label>

        <button class="btn">Paga €425,70</button>
        <p class="mini">Cancellazione gratuita fino a 48h prima (esempio).</p>
      </section>
    </main>

    <aside class="side card desktop-only">
      <div class="hotel">
        <div class="thumb">HOTEL • COVER</div>
        <div class="hotel-info">
          <h2 class="hotel-name">Hotel Mare Azzurro</h2>
          <div class="perk-list">
            <span class="perk">50 m dal mare</span>
            <span class="perk">Colazione inclusa</span>
            <span class="perk">Wi-Fi</span>
          </div>
        </div>
      </div>

      <div class="stay">
        <div><span>Check-in</span><strong>12/09/2025</strong></div>
        <div><span>Check-out</span><strong>15/09/2025</strong></div>
        <div><span>Pernotti</span><strong>3</strong></div>
        <div><span>Ospiti</span><strong>2 adulti • 1 camera</strong></div>
      </div>

      <hr />

      <div class="total-box">
        <div class="row"><span>€129 × 3 notti</span><span>€387,00</span></div>
        <div class="row"><span>Tasse (10%)</span><span>€38,70</span></div>
        <div class="row total"><span>Totale</span><strong>€425,70</strong></div>
      </div>

      <ul class="bullets">
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