<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'

const theme = inject('theme')

const searchText = ref('1')
const pokemon = ref(null)
const loading = ref(false)
const error = ref('')
const favorites = ref(JSON.parse(localStorage.getItem('poke_favorites') || '[]'))
const isShiny = ref(false)
const evolutionChain = ref([])
const evolutionLoading = ref(false)
const tiltX = ref(0)
const tiltY = ref(0)

const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
}

let debounceTimer = null
watch(searchText, (val) => {
  clearTimeout(debounceTimer)
  if (!val.trim()) return
  debounceTimer = setTimeout(() => fetchPokemon(val.trim()), 400)
})

const cardBg = computed(() => {
  if (!pokemon.value || !pokemon.value.types.length) return 'rgba(255,255,255,0.05)'
  const primary = typeColors[pokemon.value.types[0]] || '#888'
  return `${primary}18`
})

const cardBorder = computed(() => {
  if (!pokemon.value || !pokemon.value.types.length) return 'rgba(255,255,255,0.1)'
  const primary = typeColors[pokemon.value.types[0]] || '#888'
  return `${primary}40`
})

const primaryTypeColor = computed(() => {
  if (!pokemon.value || !pokemon.value.types.length) return '#888'
  return typeColors[pokemon.value.types[0]] || '#888'
})

const isFav = computed(() => {
  return pokemon.value ? favorites.value.includes(pokemon.value.id) : false
})

const particleTypes = computed(() => pokemon.value?.types || [])

async function fetchPokemon(query) {
  loading.value = true
  error.value = ''
  evolutionChain.value = []
  isShiny.value = false
  try {
    const cleanQuery = query.toString().toLowerCase().trim()
    if (!cleanQuery) throw new Error('Ingresa un nombre o ID')

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanQuery}`)
    if (!res.ok) throw new Error('Pokemon no encontrado')
    const data = await res.json()
    pokemon.value = {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      imageShiny: data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny,
      types: data.types.map(t => t.type.name),
      stats: data.stats.map(s => ({
        name: translateStat(s.stat.name),
        value: s.base_stat,
      })),
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities.map(a => ({
        name: a.ability.name,
        hidden: a.is_hidden,
      })),
    }
    searchText.value = String(data.id)
    fetchEvolutionChain(data.id)
  } catch (e) {
    error.value = e.message
    pokemon.value = null
  } finally {
    loading.value = false
  }
}

async function fetchEvolutionChain(id) {
  evolutionLoading.value = true
  try {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    const speciesData = await speciesRes.json()
    const evoRes = await fetch(speciesData.evolution_chain.url)
    const evoData = await evoRes.json()
    const names = []
    function extract(chain) {
      if (!chain) return
      names.push(chain.species.name)
      if (chain.evolves_to.length) {
        chain.evolves_to.forEach(e => extract(e))
      }
    }
    extract(evoData.chain)
    const evoDetails = await Promise.all(
      names.map(async (n) => {
        try {
          const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${n}`)
          const d = await r.json()
          return {
            id: d.id,
            name: n,
            sprite: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
          }
        } catch { return { id: null, name: n, sprite: '' } }
      })
    )
    evolutionChain.value = evoDetails
  } catch { evolutionChain.value = [] }
  finally { evolutionLoading.value = false }
}

function translateStat(name) {
  const map = {
    hp: 'HP', attack: 'Ataque', defense: 'Defensa',
    'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidad',
  }
  return map[name] || name
}

function statColor(value) {
  if (value >= 100) return '#42b883'
  if (value >= 60) return '#f4a261'
  return '#e76f51'
}

function searchPokemon() {
  fetchPokemon(searchText.value)
}

function prevPokemon() {
  if (pokemon.value && pokemon.value.id > 1) {
    searchText.value = String(pokemon.value.id - 1)
    fetchPokemon(searchText.value)
  }
}

function nextPokemon() {
  if (pokemon.value && pokemon.value.id < 1025) {
    searchText.value = String(pokemon.value.id + 1)
    fetchPokemon(searchText.value)
  }
}

function randomPokemon() {
  const rand = Math.floor(Math.random() * 1025) + 1
  searchText.value = String(rand)
  fetchPokemon(searchText.value)
}

function toggleFavorite() {
  if (!pokemon.value) return
  const id = pokemon.value.id
  const idx = favorites.value.indexOf(id)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem('poke_favorites', JSON.stringify(favorites.value))
}

function handleTilt(e) {
  const el = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - el.left - el.width / 2
  const y = e.clientY - el.top - el.height / 2
  tiltX.value = (y / el.height) * -20
  tiltY.value = (x / el.width) * 20
}

function resetTilt() {
  tiltX.value = 0
  tiltY.value = 0
}

fetchPokemon(1)
</script>

<template>
  <div class="pokemon-card" :style="{ background: cardBg, borderColor: cardBorder }">
    <div class="card-inner">
      <div class="header-row">
        <span class="chip" :style="{ background: primaryTypeColor + '22', color: primaryTypeColor, borderColor: primaryTypeColor + '44' }">
          #{{ pokemon?.id || '???' }}
        </span>
        <div class="header-actions">
          <button class="icon-btn" @click="toggleFavorite" :title="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'">
            <span v-if="isFav" class="fav-star active">&#9733;</span>
            <span v-else class="fav-star">&#9734;</span>
          </button>
          <button class="icon-btn" @click="randomPokemon" title="Pokemon aleatorio">&#127922;</button>
        </div>
      </div>

      <div class="search-row">
        <button class="nav-btn" @click="prevPokemon" :disabled="!pokemon || pokemon.id <= 1">&#8249;</button>
        <input
          v-model="searchText"
          type="text"
          placeholder="Nombre o ID"
          @keyup.enter="searchPokemon"
          class="search-input"
        />
        <button class="nav-btn" @click="nextPokemon" :disabled="!pokemon || pokemon.id >= 1025">&#8250;</button>
        <button class="btn-search" @click="searchPokemon" :disabled="loading">
          <span v-if="!loading">&#128269;</span>
          <span v-else class="spinner"></span>
        </button>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <Transition name="card-fade">
        <div v-if="pokemon" class="card-body" :key="pokemon.id + (isShiny ? '-shiny' : '')">
          <div
            class="sprite-wrapper"
            :class="{ shiny: isShiny }"
            @mousemove="handleTilt"
            @mouseleave="resetTilt"
            :style="{ transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }"
          >
            <img
              :src="isShiny ? pokemon.imageShiny : pokemon.image"
              :alt="pokemon.name"
              class="sprite"
            />
            <div class="sprite-bg" :style="{ background: `radial-gradient(circle, ${primaryTypeColor}22, transparent)` }"></div>
            <div class="particles">
              <span
                v-for="i in 12"
                :key="i"
                class="particle"
                :style="{
                  '--x': Math.sin(i * 1.2) * 80 + 'px',
                  '--y': Math.cos(i * 1.2) * 80 + 'px',
                  animationDelay: i * 0.15 + 's',
                  background: typeColors[particleTypes[i % particleTypes.length]] || primaryTypeColor,
                }"
              ></span>
            </div>
          </div>

          <div class="shiny-toggle">
            <button class="shiny-btn" :class="{ active: isShiny }" @click="isShiny = !isShiny">
              {{ isShiny ? '&#10003; Shiny' : '&#10022; Shiny' }}
            </button>
          </div>

          <h2 class="poke-name">{{ pokemon.name }}</h2>

          <div class="type-row">
            <span
              v-for="type in pokemon.types"
              :key="type"
              class="type-badge"
              :style="{ background: typeColors[type] || '#888' }"
            >{{ type }}</span>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">Altura</span>
              <span class="info-value">{{ pokemon.height }} m</span>
            </div>
            <div class="info-item">
              <span class="info-label">Peso</span>
              <span class="info-value">{{ pokemon.weight }} kg</span>
            </div>
          </div>

          <div class="stats-section">
            <h3>Estadisticas</h3>
            <div v-for="stat in pokemon.stats" :key="stat.name" class="stat-row">
              <span class="stat-name">{{ stat.name }}</span>
              <div class="stat-bar-track">
                <div
                  class="stat-bar-fill"
                  :style="{
                    width: Math.min(stat.value, 255) + 'px',
                    maxWidth: '100%',
                    background: statColor(stat.value),
                  }"
                ></div>
              </div>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>

          <div v-if="pokemon.abilities.length" class="abilities-section">
            <h3>Habilidades</h3>
            <div class="ability-tags">
              <span
                v-for="abil in pokemon.abilities"
                :key="abil.name"
                class="ability-tag"
                :class="{ hidden: abil.hidden }"
              >
                {{ abil.name }}
                <small v-if="abil.hidden">(oculta)</small>
              </span>
            </div>
          </div>

          <div v-if="evolutionChain.length > 1" class="evolution-section">
            <h3>Evoluciones</h3>
            <div class="evo-row">
              <template v-for="(evo, i) in evolutionChain" :key="evo.name">
                <div
                  class="evo-item"
                  :class="{ current: evo.id === pokemon.id }"
                  @click="fetchPokemon(evo.id)"
                >
                  <img v-if="evo.sprite" :src="evo.sprite" :alt="evo.name" class="evo-sprite" />
                  <span class="evo-name">{{ evo.name }}</span>
                </div>
                <span v-if="i < evolutionChain.length - 1" class="evo-arrow">&#10132;</span>
              </template>
            </div>
          </div>
          <div v-else-if="evolutionLoading" class="evolution-section">
            <p class="evo-loading">Cargando evoluciones...</p>
          </div>
        </div>
      </Transition>

      <div v-if="loading && !pokemon" class="loading-state">
        <div class="spinner large"></div>
        <p>Buscando...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  border: 1px solid;
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: transform 0.3s, box-shadow 0.3s, background 0.5s, border-color 0.5s;
}
.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.card-inner { padding: 28px; }

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.header-actions { display: flex; gap: 4px; }

.chip {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid;
}

.icon-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 1px solid var(--card-border, rgba(255,255,255,0.15));
  background: var(--card-bg, rgba(255,255,255,0.05));
  color: var(--text, #fff);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}
.icon-btn:hover { background: rgba(255,255,255,0.12); transform: scale(1.1); }

.fav-star { font-size: 1.1rem; transition: all 0.3s; }
.fav-star.active { color: #f4a261; }

.search-row {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 12px 14px;
  background: var(--input-bg, rgba(255,255,255,0.06));
  border: 1px solid var(--input-border, rgba(255,255,255,0.15));
  border-radius: 12px;
  color: var(--text, #fff);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: all 0.3s;
}
.search-input:focus {
  border-color: v-bind(primaryTypeColor);
  box-shadow: 0 0 20px rgba(244,162,97,0.15);
}

.nav-btn {
  padding: 12px 10px;
  background: var(--btn-ghost-bg, rgba(255,255,255,0.08));
  border: 1px solid var(--btn-ghost-border, rgba(255,255,255,0.15));
  border-radius: 12px;
  color: var(--text, #fff);
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.25s;
  line-height: 1;
}
.nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.15); }
.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-search {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f4a261, #e76f51);
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-search:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(244,162,97,0.5); }
.btn-search:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  display: inline-block;
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.spinner.large { width: 40px; height: 40px; border-width: 3px; }

@keyframes spin { to { transform: rotate(360deg); } }

.error-msg {
  text-align: center;
  color: #e63946;
  background: rgba(230,57,70,0.1);
  padding: 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 12px;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: var(--text-dim, rgba(255,255,255,0.5));
}

.card-body { text-align: center; }

.sprite-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 4px;
  cursor: pointer;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
}

.sprite {
  width: 180px;
  height: 180px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
  transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
}

.sprite-wrapper.shiny .sprite {
  filter: drop-shadow(0 8px 20px rgba(244,162,97,0.5)) brightness(1.1);
}

.sprite-bg {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 150px; height: 150px;
  border-radius: 50%;
  z-index: 0;
  transition: background 0.5s;
}

.particles {
  position: absolute;
  top: 50%; left: 50%;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  opacity: 0;
  animation: particle-float 2.5s ease-in-out infinite;
}

@keyframes particle-float {
  0% { opacity: 0; transform: translate(0, 0) scale(0); }
  20% { opacity: 0.8; }
  50% { opacity: 0.5; transform: translate(var(--x), var(--y)) scale(1); }
  100% { opacity: 0; transform: translate(calc(var(--x) * 1.8), calc(var(--y) * 1.8)) scale(0); }
}

.shiny-toggle {
  margin-bottom: 8px;
}

.shiny-btn {
  padding: 4px 16px;
  border-radius: 20px;
  border: 1px solid var(--card-border, rgba(255,255,255,0.15));
  background: transparent;
  color: var(--text-dim, rgba(255,255,255,0.5));
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}
.shiny-btn:hover { border-color: #f4a261; color: #f4a261; }
.shiny-btn.active {
  background: rgba(244,162,97,0.2);
  border-color: #f4a261;
  color: #f4a261;
}

.poke-name {
  font-size: 1.6rem;
  font-weight: 700;
  text-transform: capitalize;
  margin-bottom: 10px;
  color: var(--text, #fff);
}

.type-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}

.type-badge {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
}

.info-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  flex: 1;
  background: var(--row-bg, rgba(255,255,255,0.04));
  border-radius: 12px;
  padding: 12px;
}
.info-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-dim, rgba(255,255,255,0.4));
  margin-bottom: 4px;
}
.info-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text, #fff);
}

.stats-section h3, .abilities-section h3, .evolution-section h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-dim, rgba(255,255,255,0.4));
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.stat-name {
  width: 70px;
  font-size: 0.75rem;
  color: var(--text-dim, rgba(255,255,255,0.6));
  text-align: right;
  flex-shrink: 0;
}
.stat-bar-track {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
}
.stat-value {
  width: 32px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text, rgba(255,255,255,0.8));
  text-align: left;
}

.abilities-section {
  margin-top: 20px;
}

.ability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.ability-tag {
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--row-bg, rgba(255,255,255,0.04));
  border: 1px solid var(--card-border, rgba(255,255,255,0.1));
  font-size: 0.8rem;
  text-transform: capitalize;
  color: var(--text, #fff);
}

.ability-tag.hidden {
  border-style: dashed;
  opacity: 0.7;
}

.ability-tag small {
  font-size: 0.65rem;
  color: var(--text-dim, rgba(255,255,255,0.5));
  margin-left: 4px;
}

.evolution-section {
  margin-top: 20px;
}

.evo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.evo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  min-width: 80px;
}

.evo-item:hover {
  background: var(--row-bg, rgba(255,255,255,0.04));
  transform: translateY(-3px);
}

.evo-item.current {
  border-color: v-bind(primaryTypeColor);
  background: v-bind('primaryTypeColor + "15"');
}

.evo-sprite {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.evo-name {
  font-size: 0.75rem;
  text-transform: capitalize;
  color: var(--text-dim, rgba(255,255,255,0.6));
  margin-top: 4px;
}

.evo-item.current .evo-name {
  color: v-bind(primaryTypeColor);
  font-weight: 700;
}

.evo-arrow {
  font-size: 1.2rem;
  color: var(--text-dim, rgba(255,255,255,0.3));
}

.evo-loading {
  font-size: 0.8rem;
  color: var(--text-dim, rgba(255,255,255,0.5));
}

.card-fade-enter-active { transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
.card-fade-leave-active { transition: all 0.2s ease-in; }
.card-fade-enter-from { opacity: 0; transform: translateY(16px) scale(0.96); }
.card-fade-leave-to { opacity: 0; }
</style>
