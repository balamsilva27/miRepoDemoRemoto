<script setup>
import { ref, provide } from 'vue'
import Counter from './components/Counter.vue'
import UserForm from './components/UserForm.vue'
import PokemonCard from './components/PokemonCard.vue'

const tabs = [
  { id: 'counter', label: 'Contador', icon: '#', color: '#42b883' },
  { id: 'pokemon', label: 'Pokemon', icon: '\u2666', color: '#f4a261' },
  { id: 'form', label: 'Formulario', icon: '\u270E', color: '#48cae4' },
]
const activeTab = ref('counter')

const isDark = ref(true)
provide('theme', isDark)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="app-wrapper" :class="{ light: !isDark }">
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    <header>
      <h1>
        <span class="icon">&#9651;</span>
        Mi App Vue
        <span class="icon">&#9651;</span>
      </h1>
      <div class="header-controls">
        <p class="subtitle">Counter &middot; Pokemon &middot; Formulario</p>
        <button class="theme-btn" @click="toggleTheme" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
          {{ isDark ? '\u2600' : '\u263D' }}
        </button>
      </div>
    </header>

    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        :style="{ '--tab-color': tab.color }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </nav>

    <main>
      <Transition name="tab" mode="out-in">
        <Counter v-if="activeTab === 'counter'" key="counter" />
        <PokemonCard v-else-if="activeTab === 'pokemon'" key="pokemon" />
        <UserForm v-else key="form" />
      </Transition>
    </main>

    <footer>
      <p>Hecho con &#10084; y Vue 3</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root,
[data-theme='dark'] {
  --bg-start: #0f0c29;
  --bg-mid: #302b63;
  --bg-end: #24243e;
  --text: #fff;
  --text-dim: rgba(255,255,255,0.5);
  --text-xdim: rgba(255,255,255,0.3);
  --card-bg: rgba(255,255,255,0.05);
  --card-border: rgba(255,255,255,0.1);
  --input-bg: rgba(255,255,255,0.06);
  --input-border: rgba(255,255,255,0.15);
  --btn-ghost-bg: rgba(255,255,255,0.08);
  --btn-ghost-border: rgba(255,255,255,0.15);
  --row-bg: rgba(255,255,255,0.04);
}

[data-theme='light'] {
  --bg-start: #e8f0fe;
  --bg-mid: #d4e4fc;
  --bg-end: #c8ddf8;
  --text: #1a1a2e;
  --text-dim: rgba(26,26,46,0.6);
  --text-xdim: rgba(26,26,46,0.35);
  --card-bg: rgba(255,255,255,0.7);
  --card-border: rgba(0,0,0,0.1);
  --input-bg: rgba(255,255,255,0.9);
  --input-border: rgba(0,0,0,0.15);
  --btn-ghost-bg: rgba(0,0,0,0.05);
  --btn-ghost-border: rgba(0,0,0,0.12);
  --row-bg: rgba(0,0,0,0.04);
}

body {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-start), var(--bg-mid), var(--bg-end));
  color: var(--text);
  overflow-x: hidden;
  transition: background 0.5s, color 0.5s;
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.bg-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}

.light .shape { opacity: 0.25; }

.shape-1 {
  width: 400px; height: 400px;
  background: #42b883;
  top: -100px; left: -100px;
}
.shape-2 {
  width: 350px; height: 350px;
  background: #0077b6;
  bottom: -80px; right: -80px;
  animation-delay: -7s;
}
.shape-3 {
  width: 300px; height: 300px;
  background: #e63946;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

h1 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #42b883, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.icon {
  font-size: 1.8rem;
  -webkit-text-fill-color: initial;
  color: #42b883;
  animation: pulse-icon 2s infinite;
}

@keyframes pulse-icon {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.header-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.subtitle {
  color: var(--text-dim);
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.theme-btn {
  background: none;
  border: 1px solid var(--card-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: var(--text);
}

.theme-btn:hover {
  background: var(--card-bg);
  transform: rotate(30deg) scale(1.1);
}

.tab-nav {
  display: flex;
  gap: 4px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 4px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(20px);
}

.tab-btn {
  padding: 10px 22px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--text-dim);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: var(--text);
  background: rgba(128,128,128,0.1);
}

.tab-btn.active {
  background: var(--card-bg);
  color: var(--tab-color);
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}

.tab-icon {
  font-size: 1.1rem;
}

main {
  display: flex;
  justify-content: center;
  max-width: 500px;
  width: 100%;
  position: relative;
  z-index: 1;
}

main > * {
  width: 100%;
}

.tab-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.tab-leave-active {
  transition: all 0.2s ease-in;
}
.tab-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
.tab-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

footer {
  margin-top: 40px;
  color: var(--text-xdim);
  font-size: 0.85rem;
  position: relative;
  z-index: 1;
}
</style>
