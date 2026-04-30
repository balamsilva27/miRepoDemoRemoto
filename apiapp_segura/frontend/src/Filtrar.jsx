import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TYPE_COLORS, formatStatName, getStatColor } from "./utils";

export default function Filtrar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const res = await axios.get(`http://localhost:3000/api/pokemon/${query.toLowerCase().trim()}`);
      setResult(res.data);
    } catch (err) {
      setError("Pokémon no encontrado. Verifica el nombre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header" style={{backgroundColor: "#ff9800"}}>
        <h1>Búsqueda en la Pokédex</h1>
      </div>
      <div className="content">
        <Link to="/home" className="back-link">◂ Volver al Home</Link>
        <h2 style={{ marginBottom: "1rem", color: "var(--secondary-color)", fontWeight: "800" }}>Buscar un Pokémon</h2>

        <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "500px" }}>
          <div className="form-group" style={{ flexDirection: "row", gap: "0.5rem" }}>
            <input type="text" placeholder="Ej. pikachu, rayquaza, 25..." value={query} onChange={e => setQuery(e.target.value)} required />
            <button type="submit" className="btn-primary" style={{ width: "auto" }}>Buscar</button>
          </div>
        </form>

        {loading ? (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="Loading" className="loading-pokeball" style={{width: "80px", height: "80px"}} />
            <h3 style={{color: "#888"}}>Consultando bases de datos...</h3>
          </div>
        ) : error ? (
           <p className="error-msg" style={{ marginTop: "1rem" }}>{error}</p>
        ) : result ? (
          <div className="pokemon-card">
            <div className="pokemon-img-container">
              <img 
                src={result.sprites?.other?.["official-artwork"]?.front_default || result.sprites?.front_default} 
                alt={result.name} 
                className="pokemon-img" 
              />
            </div>
            <div className="pokemon-id">N.º {result.id.toString().padStart(4, "0")}</div>
            <h3 className="pokemon-name">{result.name}</h3>

            <div className="pokemon-types">
              {result.types?.map((t, idx) => (
                <span key={idx} className="type-badge" style={{ backgroundColor: TYPE_COLORS[t.type.name] || "#777" }}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Altura</span>
                <span className="info-value">{result.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{result.weight / 10} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Habilidad</span>
                <span className="info-value" style={{fontSize: "1rem", textTransform: "capitalize"}}>{result.abilities?.[0]?.ability?.name}</span>
              </div>
            </div>

            <div className="stats-grid">
              {result.stats.map(s => (
                <div key={s.stat.name} className="stat-row">
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                    <span className="stat-name">{formatStatName(s.stat.name)}</span>
                    <span className="stat-name" style={{color: "var(--secondary-color)"}}>{s.base_stat}</span>
                  </div>
                  <div className="stat-bar-bg">
                    <div className="stat-bar-fill" style={{ width: `${Math.min(s.base_stat, 100)}%`, backgroundColor: getStatColor(s.base_stat) }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
