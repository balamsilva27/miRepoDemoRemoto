import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Card from './componentes/Card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Card 
      imagen="imagen1"
      nombre="Jefrey"
      pais="México"
      contenido="Hola, soy Jefrey y vivo en México."
    
    />
    <Card 
      imagen="imagen2"
      nombre="Diddy"
      pais="España"
      contenido="Hola, soy Diddy y vivo en España."
    />
    <Card 
      imagen="imagen3"
      nombre="Maduro"
      pais="Venezuela"
      contenido="Hola, soy Maduro y vivo en Venezuela."
    />
  </StrictMode>,
)

