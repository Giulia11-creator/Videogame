import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";
import { useRef } from "react";
import "../styles/travel.css";

const TravelPage = () => {

    return (
        <div className="container">
            <header className="header">
                <h1 className="page-title">Trova e prenota il tuo soggiorno</h1>
            </header>

            <section className="search-panel" role="search" aria-label="Filtri di ricerca">
                <form className="form-grid">
                    <label className="field">
                        <span>Check-in</span>
                        <input type="date" />
                    </label>
                    <label className="field">
                        <span>Check-out</span>
                        <input type="date" />
                    </label>
                    <label className="field">
                        <span>Adulti</span>
                        <input type="number" />
                    </label>
                    <label className="field">
                        <span>Bambini</span>
                        <input type="number" />
                    </label>
                    <label className="field">
                        <span>Camere</span>
                        <select>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </select>
                    </label>
              
                </form>
            </section>

            <section aria-label="Risultati hotel">
                <div className="cards">
                    <article className="card">
                        <div className="media">HOTEL • COVER</div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title">Hotel Mare Azzurro</h2>
                                <div className="stars">★★★★☆</div>
                            </div>
                            <div className="meta">
                                <span className="pill">50 m dal mare</span>
                                <span className="pill">Colazione inclusa</span>
                                <span className="pill">Wi‑Fi</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price">€ 129<span className="small"> / notte</span></div>
                                    <div className="small">Cancellazione gratuita</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy">Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="media">HOTEL • COVER</div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title">Boutique Centro Storico</h2>
                                <div className="stars">★★★★★</div>
                            </div>
                            <div className="meta">
                                <span className="pill">Centro città</span>
                                <span className="pill">Spa &amp; Gym</span>
                                <span className="pill">Pet‑friendly</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price">€ 189<span className="small"> / notte</span></div>
                                    <div className="small">Pagamento in struttura</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy">Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="media">HOTEL • COVER</div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title">Eco Lodge Collina</h2>
                                <div className="stars">★★★★☆</div>
                            </div>
                            <div className="meta">
                                <span className="pill">Parcheggio gratuito</span>
                                <span className="pill">Ristorante</span>
                                <span className="pill">Vicino a sentieri</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price">€ 99<span className="small"> / notte</span></div>
                                    <div className="small">Offerta limitata</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy">Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="media">HOTEL • COVER</div>
                        <div className="card-body">
                            <div className="title-row">
                                <h2 className="title">Resort Lago Sereno</h2>
                                <div className="stars">★★★★☆</div>
                            </div>
                            <div className="meta">
                                <span className="pill">Vista lago</span>
                                <span className="pill">Piscina</span>
                                <span className="pill">Colazione inclusa</span>
                            </div>
                            <div className="price-row">
                                <div>
                                    <div className="price">€ 149<span className="small"> / notte</span></div>
                                    <div className="small">Cancellazione gratuita</div>
                                </div>
                                <div className="cta">
                                    <button className="btn-buy">Acquista</button>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );




};

export default TravelPage;