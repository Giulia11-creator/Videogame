import { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import "../styles/ui.css";
import {UserAuth} from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {createUser} = UserAuth();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {

      await createUser(email, password);
      navigate("/game");

      
    } catch (e) {

      console.log(e.message);
      
    }
  };

  useEffect(() => {
    document.body.classList.add("ui-screen");
    return () => document.body.classList.remove("ui-screen");
  }, []);

  return (
    <div className="signin-wrapper">
      <div className="signin-page">
        <div className="signin-card">
          <div className="signin-header">
            <h2 className="signin-title">Iscriviti</h2>
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
                    onChange={(e) => setPassword (e.target.value)}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="actions">
                <button type="submit" className="btn-primary">Sign up</button>
              </div>
            </form>

            <p className="bottom-note">
              Possiedi un account?{" "}
              <Link to="/login" className="link-cta">Accedi</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
