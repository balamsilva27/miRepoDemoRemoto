// Existen 5 formas de acceder a los elementos de un documento: 

// .getElementById()
// .getElementsByClassName()
// .getElementsByTagName()
// .querySelector()
// .querySelectorAll()


// Vincular un elemento html con un objeto de JavaScript
// const obj_tittle = document.getElementById("titulo");
// console.log(obj_tittle.parentElement);


// const contenedor = document.getElementsByClassName("contenedor");
// console.log(contenedor[0].classList);

// const items = document.getElementsByTagName("li");
// console.log(items[0].innerText);

// const  titulo = document.querySelector("#titulo");
// titulo.innerText="Nuevo titulo desde JS";
// titulo.style.backgroundColor = "white";

// const ul = document.getElementsByTagName("ul");
// console.log(ul[0].innerText);
// console.log(ul[0].textContent);
// console.log(ul[0].innerHTML);

// const ancla = document.getElementsByTagName("a");
// console.log(ancla[0].getAttribute("href"));
// ancla[0].setAttribute("href", "https://www.github.org");

// const container = document.getElementsByClassName("contenedor");
// console.log(container);
// console.log(container[0].classList.contains("items-color1")); 
// container[0].classList.add("texto-marron");
// container[0].classList.remove("texto-marron");

const listaItems = document.getElementsByTagName("ul");
const item_nuevo = document.createElement("li");
item_nuevo.innerText = "Elemento 5";
item_nuevo.classList.add("items-color1");
listaItems[0].append(item_nuevo)
item_nuevo.remove();