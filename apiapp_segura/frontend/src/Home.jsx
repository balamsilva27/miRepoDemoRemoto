import { useAuth } from "./AuthProvider";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  
  return (
    <>
      <div className="header">
        <h1>Pokémon Center</h1>
        <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
      </div>
      <div className="content">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" style={{ width: "100px", marginBottom: "1rem" }} />
        <h2 style={{ fontSize: "2rem", color: "var(--secondary-color)", fontWeight: "800" }}>¡Hola, {user}!</h2>
        <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "1.1rem" }}>¿Qué deseas hacer hoy?</p>

        <div className="nav-links">
          <Link to="/detalles">
            <span style={{ fontSize: "2rem" }}>🎲</span>
            Descubrir Random
          </Link>
          <Link to="/filtrar" style={{ borderColor: "#ff9800", color: "#ff9800" }}>
             <span style={{ fontSize: "2rem" }}>🔍</span>
            Búsqueda Exacta
          </Link>
        </div>
      </div>
    </>
  );
}
