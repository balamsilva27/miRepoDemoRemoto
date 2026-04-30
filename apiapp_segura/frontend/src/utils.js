export const TYPE_COLORS = {
  normal: "var(--type-normal)", fire: "var(--type-fire)", water: "var(--type-water)", electric: "var(--type-electric)",
  grass: "var(--type-grass)", ice: "var(--type-ice)", fighting: "var(--type-fighting)", poison: "var(--type-poison)",
  ground: "var(--type-ground)", flying: "var(--type-flying)", psychic: "var(--type-psychic)", bug: "var(--type-bug)",
  rock: "var(--type-rock)", ghost: "var(--type-ghost)", dragon: "var(--type-dragon)", dark: "var(--type-dark)",
  steel: "var(--type-steel)", fairy: "var(--type-fairy)"
};

export const formatStatName = (name) => {
  const map = { hp: "HP", attack: "ATK", defense: "DEF", "special-attack": "SP.ATK", "special-defense": "SP.DEF", speed: "SPD" };
  return map[name] || name;
};

export const getStatColor = (value) => {
  if (value < 50) return "#ff4d4f";
  if (value < 80) return "#ffca28";
  if (value < 110) return "#66bb6a";
  return "#29b6f6";
};
