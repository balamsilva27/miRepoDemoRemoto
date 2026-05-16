<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'

const theme = inject('theme')

const count = ref(0)
const step = ref(1)
const bounceKey = ref(0)

const saved = localStorage.getItem('counter_value')
if (saved !== null) count.value = Number(saved)

const glowColor = computed(() => {
  if (count.value > 0) return '#42b883'
  if (count.value < 0) return '#e63946'
  return '#ffffff'
})

function increment() {
  count.value += step.value
  bounceKey.value++
  save()
}

function decrement() {
  count.value -= step.value
  bounceKey.value++
  save()
}

function reset() {
  count.value = 0
  bounceKey.value++
  save()
}

function save() {
  localStorage.setItem('counter_value', count.value)
}

function handleKeydown(e) {
  if (e.key === 'ArrowUp' || e.key === '+') { e.preventDefault(); increment() }
  if (e.key === 'ArrowDown' || e.key === '-') { e.preventDefault(); decrement() }
  if (e.key === 'r' || e.key === 'R') { e.preventDefault(); reset() }
}

function createRipple(e) {
  const btn = e.currentTarget
  const ripple = document.createElement('span')
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px'
  ripple.className = 'ripple-effect'
  btn.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove())
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="counter-card">
    <div class="card-glow" :style="{ '--glow': glowColor }"></div>
    <div class="card-inner">
      <div class="icon-row">
        <span class="chip">Contador</span>
        <span class="step-hint">Paso: {{ step }}</span>
      </div>

      <div class="count-circle" :class="{ positive: count > 0, negative: count < 0 }">
        <span class="count-label">VALOR</span>
        <span class="count-number" :key="bounceKey">{{ count }}</span>
      </div>

      <div class="step-row">
        <button
          v-for="s in [1, 5, 10]"
          :key="s"
          class="step-chip"
          :class="{ active: step === s }"
          @click="step = s"
        >{{ s }}</button>
      </div>

      <div class="actions">
        <button class="btn btn-dec" @click="decrement" @mousedown="createRipple">
          <span class="btn-icon">-</span>
          Decrementar
        </button>
        <button class="btn btn-reset" @click="reset" @mousedown="createRipple">
          <span class="btn-icon">&#8634;</span>
          Reset
        </button>
        <button class="btn btn-inc" @click="increment" @mousedown="createRipple">
          <span class="btn-icon">+</span>
          Incrementar
        </button>
      </div>

      <p class="kbd-hint">Teclas: &uarr; &darr; / + - / R</p>
    </div>
  </div>
</template>

<style scoped>
.counter-card {
  position: relative;
  background: var(--card-bg, rgba(255,255,255,0.05));
  border: 1px solid var(--card-border, rgba(255,255,255,0.1));
  border-radius: 24px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.counter-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, var(--glow, #fff) 0%, transparent 40%);
  opacity: 0.08;
  transition: background 0.5s;
  pointer-events: none;
}

.card-inner {
  position: relative;
  padding: 28px;
  z-index: 1;
}

.icon-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chip {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: rgba(66,184,131,0.15);
  color: #42b883;
  border: 1px solid rgba(66,184,131,0.3);
}

.step-hint {
  font-size: 0.75rem;
  color: var(--text-dim, rgba(255,255,255,0.5));
  font-weight: 500;
}

.count-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.03);
  border: 3px solid rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
  position: relative;
  overflow: hidden;
}

.count-circle.positive {
  border-color: rgba(66,184,131,0.6);
  box-shadow: 0 0 40px rgba(66,184,131,0.25);
}

.count-circle.negative {
  border-color: rgba(230,57,70,0.6);
  box-shadow: 0 0 40px rgba(230,57,70,0.25);
}

.count-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-dim, rgba(255,255,255,0.4));
  margin-bottom: 2px;
}

.count-number {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1;
  transition: color 0.4s;
  animation: bounce 0.35s cubic-bezier(0.175,0.885,0.32,1.275);
}

.positive .count-number { color: #42b883; }
.negative .count-number { color: #e63946; }

@keyframes bounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.35); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.step-row {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}

.step-chip {
  padding: 4px 16px;
  border-radius: 20px;
  border: 1px solid var(--card-border, rgba(255,255,255,0.15));
  background: transparent;
  color: var(--text-dim, rgba(255,255,255,0.5));
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s;
}

.step-chip:hover { color: var(--text, #fff); border-color: var(--text-dim); }
.step-chip.active {
  background: rgba(66,184,131,0.2);
  border-color: #42b883;
  color: #42b883;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 14px 12px;
  border: none;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.btn:hover { transform: translateY(-2px); }
.btn:active { transform: translateY(0) scale(0.97); }

.btn-icon {
  font-size: 1.3rem;
  font-weight: 700;
  transition: transform 0.3s;
}
.btn:hover .btn-icon { transform: scale(1.2); }

.btn-inc {
  background: linear-gradient(135deg, #42b883, #35a372);
  color: #fff;
  box-shadow: 0 4px 15px rgba(66,184,131,0.4);
}
.btn-inc:hover { box-shadow: 0 6px 25px rgba(66,184,131,0.6); }

.btn-dec {
  background: var(--btn-ghost-bg, rgba(255,255,255,0.08));
  color: var(--text, #fff);
  border: 1px solid var(--btn-ghost-border, rgba(255,255,255,0.15));
}
.btn-dec:hover { background: rgba(255,255,255,0.15); }

.btn-reset {
  flex: 0.6;
  background: var(--btn-ghost-bg, rgba(255,255,255,0.08));
  color: var(--text, #fff);
  border: 1px solid var(--btn-ghost-border, rgba(255,255,255,0.15));
}
.btn-reset:hover { background: rgba(255,255,255,0.15); }

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  pointer-events: none;
  animation: ripple 0.6s ease-out forwards;
}

@keyframes ripple {
  to { transform: scale(4); opacity: 0; }
}

.kbd-hint {
  text-align: center;
  margin-top: 14px;
  font-size: 0.7rem;
  color: var(--text-xdim, rgba(255,255,255,0.25));
  letter-spacing: 1px;
}
</style>
