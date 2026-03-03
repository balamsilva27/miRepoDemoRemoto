// const showMessage = () => {
//     setTimeout(
//         () => {
//         console.log("Hello World");
//     }, 3000);
// }

// //Esta es una funcion asincrona
// async function tarea() {
//     return "asynchronous task";

// }

// //async / await
// async function ejecuta(){
//     const resultado = await tarea();
//     console.log(resultado);
// }

// ejecuta();


//promises = tres estados: pending, fulfilled, rejected
// ejemplo de promesa

// const promesa = new Promise(
//     (resolve, reject) => {
//         const todobien = false;
//         setTimeout(() => {
//             if (todobien) {
//                 resolve("La promesa se cumplio");
//             } else {
//                 reject("La promesa no se cumplio");
//             }
//         }, 5000);
//     }


// )

// promesa.then(
//     (resultado) => console.log(resultado)
// ).catch(
//     (error) => console.log(error)
// )

// const promesaUNO = new Promise(
//     (resolve, reject) => {
//         resolve("Promesa UNO se cumplio");
//     }
// )

// const promesaDOS = new Promise(
//     (resolve, reject) => {
//         resolve("Promesa DOS se cumplio");
//     }
// )

// const promesaTRES = new Promise(
//     (resolve, reject) => {
//         resolve("Promesa TRES se cumplio");
//     }
// )

// promesaUNO.then(
//     (res) => {
//         console.log(res)
//         return promesaDOS;
//     }
// )
//     .then(
//         (res) => {
//             console.log(res)
//             return promesaTRES;
//         }
//     )
//     .catch(

//         (e) => {
//             console.log(e);

//         }
//     )

// const contenedor = document.getElementById("pokemonContainer");

// async function getPokemon() {

//     const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
//     const datos = await respuesta.json();
//     console.log(datos);
//     const detalles = await fetch(datos.results[0].url);
//     const detalles_Pokemon = await detalles.json();
//     console.log(detalles_Pokemon);



//  const col = document.createElement("div");
//     col.className="col-md-4 col-lg-3";
//     col.innerHTML = `
//     <div class="card h-100 shadow-lg bg-secondary text-white">
//         <img src="${detalles_Pokemon.sprites.other['official-artwork'].front_default}"
//         class="card-img-top p-3"
//         alt ="${detalles_Pokemon.name}">
//         <div class="card-body text-center">
//             <h5 class="card-title text-capitalize">${detalles_Pokemon.name}</h5>
//             <p class="card-text">
//                 Tipo: ${detalles_Pokemon.types.map(t => t.type.name).join(", ")}
//             </p>
//         </div>
//     </div>
//     `; contenedor.appendChild(col);

// }

// getPokemon();

const contenedor = document.getElementById("pokemonContainer");

async function getPokemon() {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
    const datos = await respuesta.json();
    datos.results.forEach(
        pokemon => {
            fetchDetalles(pokemon.url);
        }
    );
}

async function fetchDetalles(url) {
    const detalles = await fetch(url);
    const pokemo = await detalles.json();
    createcard(pokemo);
}

function createcard(Pokemon) {
    const col = document.createElement("div");
    col.className="col-md-4 col-lg-3";
    col.innerHTML = `
    <div class="card h-100 shadow-lg bg-secondary text-white">
        <img src="${Pokemon.sprites.other['official-artwork'].front_default}"
        class="card-img-top p-3"
        alt ="${Pokemon.name}">
        <div class="card-body text-center">
            <h5 class="card-title text-capitalize">${Pokemon.name}</h5>
            <p class="card-text">
                Tipo: ${Pokemon.types.map(t => t.type.name).join(", ")}
            </p>
        </div>
    </div>
    `; contenedor.appendChild(col);
}

getPokemon();