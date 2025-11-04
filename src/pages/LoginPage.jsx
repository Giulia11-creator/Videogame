import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ui.css";
import { UserAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMsg] = useState("");
  const { login } = UserAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMsg("La password deve avere almeno 8 caratteri.");
      return;
    }

    try {
      await login(email, password);
      navigate('/game');
    } catch (e) {
      // e.code: "auth/invalid-credential" (email inesistente o password errata)
      if (e.code === "auth/invalid-credential") {
        setErrorMsg("Email o password non corretti.");
      } else if (e.code === "auth/too-many-requests") {
        setErrorMsg("Troppi tentativi. Riprova più tardi.");
      } else {
        setErrorMsg("Errore durante il login: " + e.message);
      }
      console.log(e);
    }
  };


  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);

  return (
    <div className="signin-wrapper">
      <div className="signin-page">
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="signin-card">
          <div className="signin-header">
            <h2 className="signin-title">Login</h2>
          </div>

          <div className="signin-body">
            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email" className="label">Email</label>
                <div className="input-wrap">
                  <input
                    id="email"
                    type="email"
                    placeholder="la_tua_email@esempio.com"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="form-field">
                <div className="field-top">
                  <label htmlFor="password" className="label">Password</label>
                </div>
                <div className="input-wrap">
                  <input
                    id="password"
                    type="password"
                    placeholder="La tua password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn-primary">Sign in</button>
              </div>
            </form>

            <p className="bottom-note">
              Non hai un account?{" "}
              <Link to="/signup" className="link-cta">Iscriviti</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
