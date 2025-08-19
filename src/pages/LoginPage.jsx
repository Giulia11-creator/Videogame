import { useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import "../styles/ui.css";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);

  const handleLogin = () => {
    // logica di login se serve…
    navigate("/game");
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-page">
        <div className="signin-card">
          <div className="signin-header">
            <h2 className="signin-title">Login</h2>
          </div>

          <div className="signin-body">
            <form className="signin-form" onSubmit={handleLogin}>
              <div className="form-field">
                <label htmlFor="email" className="label">Email</label>
                <div className="input-wrap">
                  <input
                    id="email"
                    type="email"
                    placeholder="la_tua_email@esempio.com"
                    autoComplete="email"
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
              <Link to="/game" className="link-cta">Iscriviti</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
