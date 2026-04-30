import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TYPE_COLORS, formatStatName, getStatColor } from "./utils";

export default function Detalles() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRandomPokemon = () => {
    setLoading(true);
    setError("");
    const randomId = Math.floor(Math.random() * 1010) + 1;
    axios.get(`http://localhost:3000/api/pokemon/${randomId}`)
      .then(res => {
        setPokemon(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error al cargar el Pokémon misterioso.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <>
      <div className="header" style={{backgroundColor: "#ffcb05", color: "#303943"}}>
        <h1>Descubrir Pokémon</h1>
      </div>
      <div className="content">
        <Link to="/home" className="back-link">◂ Volver al Home</Link>
        
        {loading ? (
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" alt="Loading" className="loading-pokeball" />
            <h3 style={{color: "#888"}}>Buscando en la hierba alta...</h3>
          </div>
        ) : error ? (
           <p className="error-msg" style={{ marginTop: "2rem" }}>{error}</p>
        ) : pokemon ? (
          <div className="pokemon-card">
            <div className="pokemon-img-container">
              <img 
                src={pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default} 
                alt={pokemon.name} 
                className="pokemon-img" 
              />
            </div>
            <div className="pokemon-id">N.º {pokemon.id.toString().padStart(4, "0")}</div>
            <h3 className="pokemon-name">{pokemon.name}</h3>
            
            <div className="pokemon-types">
              {pokemon.types?.map((t, idx) => (
                <span key={idx} className="type-badge" style={{ backgroundColor: TYPE_COLORS[t.type.name] || "#777" }}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Altura</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Exp. Base</span>
                <span className="info-value">{pokemon.base_experience}</span>
              </div>
            </div>

            <div className="stats-grid">
              {pokemon.stats.map(s => (
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

            <button onClick={fetchRandomPokemon} className="btn-primary" style={{marginTop: "2rem", width: "100%", backgroundColor: "#303943"}}>
              ¡Descubrir otro Pokémon!
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
