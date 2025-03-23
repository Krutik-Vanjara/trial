import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post<{ token: string }>(
        `${import.meta.env.VITE_API_USER_SERVICE}/login`,
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Email inexistant");
        } else if (error.response.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
      } else {
        setError("Impossible de se connecter au serveur.");
      }
    }
  };

  return (
    <div className="container">
      <h1
        className="title is-1 has-text-primary has-text-centered mt-5"
        style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}
      >
        Site de Calcul de Consommation d'Énergie
      </h1>

      <div className="is-flex is-justify-content-center" style={{ marginTop: "50px" }}>
        <div className="box" style={{ width: "400px", padding: "30px" }}>
          <h2 className="title has-text-centered">Connexion</h2>

          {error && <p className="notification is-danger has-text-centered">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Mot de passe</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="button is-primary is-fullwidth mt-3" type="submit">
              Se connecter
            </button>
          </form>

          <p className="has-text-centered mt-4">
            Pas encore de compte ?{" "}
            <a href="/register" className="has-text-primary">
              Inscription
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
