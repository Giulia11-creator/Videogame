
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { TutorialDone } from "../ReactComponents/FirestoreFunction.js";
import "../styles/tutorial.css"; // il tuo file

export default function TutorialForm() {
    const { user } = UserAuth();

    const [text, setText] = useState("");
    const [text2, setText2] = useState("");
    const [text3, setText3] = useState("");
    const [output, setOutput] = useState("");
    const [output2, setOutput2] = useState("");
    const [output3, setOutput3] = useState("");
    const [step, setStep] = useState(0); // 0 input, 1 button, 2 output
    const [step2, setStep2] = useState(0);
    const [step3, setStep3] = useState(0);
    const [message, setMessage] = useState("");
    const [displayMessage, setdisplayMessage] = useState(false);
    const [message2, setMessage2] = useState("");
    const [displayMessage2, setdisplayMessage2] = useState(false);
    const [message3, setMessage3] = useState("");
    const [displayMessage3, setdisplayMessage3] = useState(false);
    const [double, setDouble] = useState(false);
    const [add, setAdd] = useState(false);
    const [num, setNum] = useState(0);
    const [triggerExampleOne, setTriggerExampleOne] = useState(() => {
        const saved = sessionStorage.getItem("triggerExampleOne");
        return saved ? JSON.parse(saved) : false;
    });
    const [triggerExampleTwo, setTriggerExampleTwo] = useState(() => {
        const saved = sessionStorage.getItem("triggerExampleTwo");
        return saved ? JSON.parse(saved) : false;
    });
    const [triggerExampleThree, setTriggerExampleThree] = useState(() => {
        const saved = sessionStorage.getItem("triggerExampleThree");
        return saved ? JSON.parse(saved) : false;
    });
    const [seconds, setseconds] = useState(() => {
        const saved = sessionStorage.getItem("TutorialTime");
        return saved ? Number(saved) : 0;
    });
    const [tutorialDone, settutorialDone] = useState(() => {
        const saved = sessionStorage.getItem("tutorialDone");
        return saved ? JSON.parse(saved) : false;
    });
      const [clicks, setClicks] = useState(() => {
    const saved = sessionStorage.getItem("clicks");
    return saved ? JSON.parse(saved) : 0;
  });

    const navigate = useNavigate();

    
  function BackToGame() {
    incrementClicks();
    navigate("/game");
  }


    useEffect(() => {

        const id = setInterval(() => {
            setseconds((prev) => {
                const next = prev + 1;
                sessionStorage.setItem("TutorialTime", next);
                return next;
            });
        }, 1000);

        return () => clearInterval(id);
    }, []);



    function handleSubmit1(e) {
        incrementClicks();
        e.preventDefault();
        setOutput("LOL");
        setStep(2);
    }


    function handleSubmit2(e) {
        incrementClicks();
        if (Number(text2)) {
            e.preventDefault();
            setOutput2(text2);
            setStep2(2);
            setMessage2("Questo è un esempio delle tipologie di bug che dovrai scovare. Come puoi vedere l'applicazione può accettare numeri anche se non dovebbe");
            setdisplayMessage2(true);
            setTriggerExampleTwo(true);
            sessionStorage.setItem("triggerExampleTwo", "true");

        }
        else {
            setMessage2("Dai prova ad inserire un numero :)");
            setdisplayMessage2(true);

        }



    }

    function clickLol() {
        incrementClicks();
        if (output === "LOL" && text != "LOL") {
            setMessage("Questo è un esempio delle tipologie di bug che dovrai scovare. Come puoi vedere l'applicazione non si comporta come dovrebbe e mostra un testo diverso da quello che hai scritto");
            setdisplayMessage(true);
            setTriggerExampleOne(true);
            sessionStorage.setItem("triggerExampleOne", "true");
        }
        else {

            setMessage("In questo caso è andato tutto come ci aspettavamo, ma prova a scrivere un'altra parola :)");
            setdisplayMessage(true);

        }


    }
    function resetMessage() {
        setdisplayMessage(false);
        setStep(0);
        setOutput("");
        setText("");
    }

    function resetMessage2() {
        setdisplayMessage2(false);
        setStep2(0);
        setOutput2("");
        setText2("");
    }

    function resetMessage3() {
        setdisplayMessage3(false);
        setStep3(0);
        setOutput3("");
        setText3("");
        setAdd(false);
        setDouble(false);
    }

    function clickAdd() {
        incrementClicks();
        setAdd(true);
        if (double) {
            setOutput3("77777");
            setStep3(2);
        }
        else
            setNum(Number(text3));



    }

    function clickDouble() {
        incrementClicks();

        setDouble(true);

        if (add) {

            setOutput3(num * 2);
            setStep3(2);

        }




    }

    function clickResult() {
        incrementClicks();
        if (Number(output3) === num * 2)
            setMessage3("Tutto si è svolto secondo la predizione, prova ad invertire l'ordine dei pulsanti");
        else
            setMessage3("Questo è un esempio delle tipologie di bug che dovrai scovare. Come puoi vedere l'ordine in cui vengono premuti i pulsanti condiziona il risulato");

        setdisplayMessage3(true);
        setTriggerExampleThree(true);
        sessionStorage.setItem("triggerExampleThree", "true");


    }

    useEffect(() => {
        if (tutorialDone) return;

        if (triggerExampleOne && triggerExampleTwo && triggerExampleThree) {
            settutorialDone(true);
            sessionStorage.setItem("tutorialDone", "true")
        }


    }, [triggerExampleOne, triggerExampleTwo, triggerExampleThree]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

    function incrementClicks() {
    setClicks((prev) => {
      const next = prev + 1;
      sessionStorage.setItem("clicks", JSON.stringify(next));
      saveProgress(next);
      return next; // importante restituire il nuovo valore
    });
  }

    async function saveProgress(nextClicks) {
    if (!user) return;
  
       await TutorialDone("users", user.uid, {
                    email: user.email,
                    clicks:nextClicks,
                    tutorialTimeSeconds: seconds,
                    tutorialTimeFormatted: formattedTime,
                    triggerExampleOne,
                    triggerExampleTwo,
                    triggerExampleThree,
                    tutorialDone,
                });
  }

  
  function BackToGame() {
    incrementClicks();
    navigate("/game");
  }

    return (
        <div className="container with-top-right" style={{ padding: 24 }}>
            <div className="title-wrap" style={{ marginBottom: 16 }}>
                <span className="title-emoji">🧭</span>
                <h1 className="hero-title Change-color">Tutorial</h1>
            </div>

            {/* ===================== PRIMO FORM ===================== */}

            <div className="tutorial-section">
                <form onSubmit={handleSubmit1} className="tutorial-stack">

                    {/* INPUT */}
                    <div className="tutorial-row">
                        <div className="tutorial-field">
                            <input
                                className="tutorial-input"
                                type="text"
                                placeholder="Scrivi qualcosa"
                                value={text}
                                required
                                onClick={incrementClicks}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    setStep(1);
                                }}
                            />
                        </div>

                        <div className={`hint ${step === 0 ? "is-on" : ""}`}>
                            <span className="hint-arrow">➜</span>
                            <span className="hint-bubble">Scrivi qui il testo</span>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="tutorial-row">
                        <button className="btn-book" type="submit">
                            Invio
                        </button>

                        <div className={`hint ${step === 1 ? "is-on" : ""}`}>
                            <span className="hint-arrow">➜</span>
                            <span className="hint-bubble">Premi per inviare</span>
                        </div>
                    </div>
                </form>

                {/* OUTPUT */}
                <div className="tutorial-row" style={{ marginTop: 14 }}>
                    <p className="tutorial-output" onClick={clickLol}>
                        Stampa di ciò che è stato scritto: <b>{output || "—"}</b>
                    </p>

                    <div className={`hint ${step === 2 ? "is-on" : ""}`}>
                        <span className="hint-arrow">➜</span>
                        <span className="hint-bubble">Prova a cliccare il risultato!</span>
                    </div>
                </div>

                {/* ===== MESSAGE ===== */}
                {displayMessage && (
                    <div className="tutorial-message">
                        <div className="icon">🐛</div>

                        <div className="content">
                            <div className="title">Attenzione</div>
                            <div className="text">{message}</div>
                        </div>

                        <button
                            type="button"
                            className="close"
                            onClick={resetMessage}
                            aria-label="Chiudi"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>

            {/* ===================== DIVIDER ===================== */}

            <hr className="tutorial-divider" />

            {/* ===================== SECONDO FORM ===================== */}

            <div className="tutorial-section">


                <form onSubmit={handleSubmit2} className="tutorial-stack">

                    {/* INPUT */}
                    <div className="tutorial-row">
                        <div className="tutorial-field">
                            <input
                                className="tutorial-input"
                                type="text"
                                placeholder="Scrivi il nome di un animale"
                                value={text2}
                                required
                                onClick={incrementClicks}
                                onChange={(e) => { setText2(e.target.value); setStep2(1); }}
                            />
                        </div>

                        <div className={`hint ${step2 === 0 ? "is-on" : ""}`}>
                            <span className="hint-arrow">➜</span>
                            <span className="hint-bubble">Prova a scrivere un numero</span>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="tutorial-row">
                        <button className="btn-book" type="submit">
                            Stampa
                        </button>

                        <div className={`hint ${step2 === 1 ? "is-on" : ""}`}>
                            <span className="hint-arrow">➜</span>
                            <span className="hint-bubble">Premi per inviare</span>
                        </div>
                    </div>
                </form>

                {/* OUTPUT */}
                <div className="tutorial-row" style={{ marginTop: 14 }}>
                    <p className="tutorial-output">
                        Stampa : <b>{output2 || "—"}</b>
                    </p>
                </div>

            </div>

            {/* ===== MESSAGE 2 ===== */}
            {displayMessage2 && (
                <div className="tutorial-message">
                    <div className="icon">🐛</div>

                    <div className="content">
                        <div className="title">Attenzione</div>
                        <div className="text">{message2}</div>
                    </div>

                    <button
                        type="button"
                        className="close"
                        onClick={resetMessage2}
                        aria-label="Chiudi"
                    >
                        &times;
                    </button>
                </div>
            )}
            {/* ===================== DIVIDER ===================== */}

            <hr className="tutorial-divider" />
            {/* ===================== TERZO ESERCIZIO ===================== */}

            <hr className="tutorial-divider" />

            <div className="tutorial-section">

                {/* INPUT */}
                <div className="tutorial-row">
                    <div className="tutorial-field">
                        <input
                            className="tutorial-input"
                            type="number"
                            placeholder="Scrivi un numero"
                            value={text3}
                            required
                            onClick={incrementClicks}
                            onChange={(e) => {
                                setText3(e.target.value);
                                setStep3(1);
                            }}
                        />
                    </div>

                    <div className={`hint ${step3 === 0 ? "is-on" : ""}`}>
                        <span className="hint-arrow">➜</span>
                        <span className="hint-bubble">Inserisci un numero</span>
                    </div>
                </div>

                {/* BOTTONI */}
                <div className="tutorial-row">

                    <div className="tutorial-buttons"> {/* AGGIUNTO */}

                        <button className="btn-book" onClick={clickAdd}>
                            Aggiungi
                        </button>

                        <button className="btn-book" onClick={clickDouble}>
                            Raddoppia
                        </button>

                    </div>
                    <div className={`hint ${step3 === 1 ? "is-on" : ""}`}>
                        <span className="hint-arrow">➜</span>
                        <span className="hint-bubble">
                            Prova prima "Aggiungi" e poi "Raddoppia", poi inverti l'ordine
                        </span>
                    </div>

                </div>

                {/* OUTPUT */}
                <div className="tutorial-row" style={{ marginTop: 14 }}>
                    <p className="tutorial-output" onClick={clickResult}>
                        Risultato: <b>{output3 || "—"}</b>
                    </p>

                    <div className={`hint ${step3 === 2 ? "is-on" : ""}`}>
                        <span className="hint-arrow">➜</span>
                        <span className="hint-bubble">
                            Clicca il risultato per analizzare cosa è successo
                        </span>
                    </div>
                </div>

            </div>

            {/* ===== MESSAGE 3 ===== */}
            {displayMessage3 && (
                <div className="tutorial-message">
                    <div className="icon">🐛</div>

                    <div className="content">
                        <div className="title">Attenzione</div>
                        <div className="text">{message3}</div>
                    </div>

                    <button
                        type="button"
                        className="close"
                        onClick={resetMessage3}
                        aria-label="Chiudi"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* ===================== CONTROLLI ===================== */}

            <div className="tutorial-controls">

                <button
                    className="btn-exit"
                    type="button"
                    onClick={BackToGame}
                >
                    Torna al gioco
                </button>
            </div>

        </div>
    );
}