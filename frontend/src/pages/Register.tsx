import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); 
        setSuccess("");

        try {
            await axios.post(
                `${import.meta.env.VITE_API_USER_SERVICE}/register`,
                { email, password }
            );

            setSuccess("Inscription réussie ! Redirection en cours..."); 
            setTimeout(() => navigate("/"), 2000);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setError("Un compte est déjà associé à cet email.");
            } else {
                setError("Erreur lors de l'inscription. Vérifiez vos informations.");
            }
        }
    };

    return (
        <div className="container">
            {/* Titre principal en haut */}
            <h1 className="title is-1 has-text-primary has-text-centered mt-5" 
                style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}>
                Créer un compte
            </h1>

            {/* Formulaire bien centré */}
            <div className="is-flex is-justify-content-center" style={{ marginTop: "50px" }}>
                <div className="box" style={{ width: "400px", padding: "30px" }}>
                    <h2 className="title has-text-centered">Inscription</h2>

                    {/* Affichage du message de succès */}
                    {success && <p className="notification is-success has-text-centered">{success}</p>}
                    {/* Affichage de l'erreur si inscription échoue */}
                    {error && <p className="notification is-danger has-text-centered">{error}</p>}

                    <form onSubmit={handleRegister}>
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
                            <label className="label">Entrez un mot de passe</label>
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

                        <button className="button is-primary is-fullwidth mt-3">S'inscrire</button>
                    </form>

                    <p className="has-text-centered mt-4">
                        Déjà un compte ? <a href="/" className="has-text-primary">Connexion</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
