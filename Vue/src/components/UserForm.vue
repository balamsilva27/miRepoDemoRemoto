<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'

const theme = inject('theme')

const STORAGE_KEY = 'user_form_data'

const name = ref('')
const email = ref('')
const submitted = ref(false)

const errors = ref({ name: '', email: '' })
const touched = ref({ name: false, email: false })

const saved = localStorage.getItem(STORAGE_KEY)
if (saved) {
  const data = JSON.parse(saved)
  name.value = data.name || ''
  email.value = data.email || ''
  submitted.value = data.submitted || false
}

const isValidEmail = computed(() => email.value.trim() !== '')

const emailError = computed(() => {
  if (!touched.value.email) return ''
  if (!email.value.trim()) return ''
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.value) ? '' : 'Ingresa un correo valido'
})

const nameError = computed(() => {
  if (!touched.value.name) return ''
  if (!name.value.trim()) return ''
  return name.value.trim().length < 3 ? 'Minimo 3 caracteres' : ''
})

const isFormValid = computed(() => {
  return name.value.trim().length >= 3 && emailError.value === '' && email.value.trim() !== ''
})

const initials = computed(() => {
  return name.value
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('') || '?'
})

watch([name, email, submitted], () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    name: name.value,
    email: email.value,
    submitted: submitted.value,
  }))
}, { deep: true })

function submitForm() {
  touched.value.name = true
  touched.value.email = true
  if (isFormValid.value) {
    submitted.value = true
  }
}

function resetForm() {
  name.value = ''
  email.value = ''
  submitted.value = false
  touched.value = { name: false, email: false }
}

function blurField(field) {
  touched.value[field] = true
}
</script>

<template>
  <div class="form-card">
    <div class="card-inner">
      <div class="header-row">
        <span class="chip">Formulario</span>
      </div>
      <h2>Registro de Usuario</h2>

      <form @submit.prevent="submitForm">
        <div class="input-group" :class="{ valid: touched.name && name.length >= 3, invalid: touched.name && name.length > 0 && name.length < 3 }">
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder=" "
            @blur="blurField('name')"
          />
          <label for="name">&#128100; Nombre completo</label>
          <div class="input-border"></div>
          <span v-if="touched.name && name.length >= 3" class="input-status">&#10003;</span>
          <span v-if="touched.name && name.length > 0 && name.length < 3" class="input-status err">&#10007;</span>
          <p v-if="nameError" class="field-error">{{ nameError }}</p>
        </div>

        <div class="input-group" :class="{ valid: isValidEmail && !emailError, invalid: touched.email && !!emailError }">
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder=" "
            @blur="blurField('email')"
          />
          <label for="email">&#9993; Correo electronico</label>
          <div class="input-border"></div>
          <span v-if="isValidEmail && !emailError" class="input-status">&#10003;</span>
          <span v-if="touched.email && emailError" class="input-status err">&#10007;</span>
          <p v-if="emailError" class="field-error">{{ emailError }}</p>
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-submit" :disabled="!isFormValid">
            <span>&#10003;</span>
            Enviar
          </button>
          <button type="button" class="btn btn-reset" @click="resetForm">
            <span>&#10005;</span>
            Limpiar
          </button>
        </div>
      </form>

      <Transition name="slide">
        <div v-if="submitted" class="result-panel">
          <div class="result-header">
            <div class="avatar">{{ initials }}</div>
            <div>
              <h3>{{ name }}</h3>
              <span class="result-email">{{ email }}</span>
            </div>
          </div>
          <div class="result-row">
            <span class="result-label">Nombre</span>
            <span class="result-value">{{ name }}</span>
          </div>
          <div class="result-row">
            <span class="result-label">Correo</span>
            <span class="result-value">{{ email }}</span>
          </div>
          <button class="btn-edit" @click="submitted = false">&#9998; Editar</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  background: var(--card-bg, rgba(255,255,255,0.05));
  border: 1px solid var(--card-border, rgba(255,255,255,0.1));
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: transform 0.3s, box-shadow 0.3s;
}
.form-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.card-inner { padding: 28px; }
.header-row { margin-bottom: 8px; }

.chip {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: rgba(0,119,182,0.15);
  color: #48cae4;
  border: 1px solid rgba(0,119,182,0.3);
}

h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text, #fff);
}

.input-group {
  position: relative;
  margin-bottom: 6px;
}

.input-group.valid input { border-color: #42b883; }
.input-group.invalid input { border-color: #e63946; }

.input-group input {
  width: 100%;
  padding: 16px 40px 8px 14px;
  background: var(--input-bg, rgba(255,255,255,0.05));
  border: 1px solid var(--input-border, rgba(255,255,255,0.15));
  border-radius: 12px;
  color: var(--text, #fff);
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: all 0.3s;
}

.input-group input:hover { border-color: rgba(72,202,228,0.3); }
.input-group input:focus { border-color: #48cae4; box-shadow: 0 0 20px rgba(72,202,228,0.15); }
.input-group.valid input:focus { border-color: #42b883; box-shadow: 0 0 20px rgba(66,184,131,0.15); }
.input-group.invalid input:focus { border-color: #e63946; box-shadow: 0 0 20px rgba(230,57,70,0.15); }

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: 6px;
  font-size: 0.65rem;
  color: #48cae4;
}
.input-group.valid input:focus ~ label,
.input-group.valid input:not(:placeholder-shown) ~ label { color: #42b883; }
.input-group.invalid input:focus ~ label,
.input-group.invalid input:not(:placeholder-shown) ~ label { color: #e63946; }

.input-group label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim, rgba(255,255,255,0.45));
  font-size: 0.9rem;
  pointer-events: none;
  transition: all 0.25s ease;
}

.input-status {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  color: #42b883;
}
.input-status.err { color: #e63946; }

.field-error {
  color: #e63946;
  font-size: 0.75rem;
  margin-top: 4px;
  margin-left: 4px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.25s;
}
.btn:hover { transform: translateY(-2px); }
.btn:active { transform: translateY(0) scale(0.97); }

.btn-submit {
  background: linear-gradient(135deg, #0077b6, #00b4d8);
  color: #fff;
  box-shadow: 0 4px 15px rgba(0,119,182,0.4);
}
.btn-submit:hover:not(:disabled) { box-shadow: 0 6px 25px rgba(0,119,182,0.6); }
.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-reset {
  background: var(--btn-ghost-bg, rgba(255,255,255,0.08));
  color: var(--text, #fff);
  border: 1px solid var(--btn-ghost-border, rgba(255,255,255,0.15));
}
.btn-reset:hover { background: rgba(255,255,255,0.15); }

.result-panel {
  margin-top: 20px;
  padding: 20px;
  background: rgba(66,184,131,0.08);
  border: 1px solid rgba(66,184,131,0.3);
  border-radius: 16px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b883, #0077b6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.result-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text, #fff);
}

.result-email {
  font-size: 0.8rem;
  color: var(--text-dim, rgba(255,255,255,0.5));
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--row-bg, rgba(255,255,255,0.04));
  border-radius: 10px;
  margin-bottom: 8px;
}
.result-row:last-of-type { margin-bottom: 12px; }

.result-label {
  font-size: 0.8rem;
  color: var(--text-dim, rgba(255,255,255,0.5));
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.result-value {
  font-weight: 600;
  color: var(--text, #fff);
  font-size: 0.95rem;
}

.btn-edit {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--btn-ghost-border, rgba(255,255,255,0.15));
  border-radius: 10px;
  background: var(--btn-ghost-bg, rgba(255,255,255,0.08));
  color: var(--text, #fff);
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-edit:hover { background: rgba(255,255,255,0.12); }

.slide-enter-active { transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
.slide-leave-active { transition: all 0.2s ease-in; }
.slide-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }
.slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
