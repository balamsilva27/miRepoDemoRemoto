import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/home");
    } catch (err) {
      alert("Credenciales incorrectas: admin / pokemon");
    }
  };

  return (
    <>
      <div className="header">
        <h1>PokéApp Segura</h1>
      </div>
      <div className="content">
        <h2 style={{ marginBottom: "2rem", color: "var(--secondary-color)" }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "320px" }}>
          <div className="form-group" style={{ flexDirection: "column", gap: "1rem" }}>
            <input type="text" placeholder="Usuario (admin)" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Contraseña (pokemon)" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}>Ingresar al Pokédex</button>
        </form>
      </div>
    </>
  );
}
