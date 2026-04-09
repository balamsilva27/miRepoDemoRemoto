import React from "react";
import "../estilos/card.css";
import imagen1 from "../imagenes/imagen1.jpg";
import imagen2 from "../imagenes/imagen2.jpg";
import imagen3 from "../imagenes/imagen3.jpg";

const imagenes = {
    imagen1, imagen2, imagen3
};


function Card(props) {
    return ( 
        <div className='contenido-card'>
            <img 
                className="imagen-card"
                src={imagenes[props.imagen]}
                alt='Foto de ${props.nombre}'
            />
            <div className="contenedor-texto-card">
                <p className='nombre-card'><strong>{props.nombre}</strong></p>
                <p className='pais-card'>{props.pais}</p>
                <p className='texto-card'>{props.contenido}</p>
            </div>
        </div>
    );
}

export default Card;