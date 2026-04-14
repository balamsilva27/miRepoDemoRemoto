import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UsaHook from './UsaHook.jsx'
import App from './App.jsx'
import { MuestraPokemon } from './UsaHookEffect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MuestraPokemon />
  </StrictMode>,
)
