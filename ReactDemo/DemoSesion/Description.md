## manejo de sesiones

## sesion

Es un mecanismo que mantiene el estado entre multiples peticiones http de un mismo usuario, debido a que http es un protocolo sin estado.
Por lo tanto, la sesion es un contexto temporal asociado a un usuario y permite: 

* Identificarlo
* Guardar informacion
* Dar continuidad en la interaccion

## Como funciona 

Cliente --> login 
Servidor --> crea una sesion y le asigna un ID = abc123
Cliente --> guarda ese ID = abc123 (cookie, localStorage, sessionStorage, Objeto JS, BaseDatos del navegador)

Cliente --> nueva peticion, debe enviar su ID
servidor --> busca el ID de la sesion y reconoce el usuario 

## Claves del funcionamiento

* La sesion se guarda en el servidor y contiene los datos del usuario
* La cookie se guarda en el clicente y contiene el ID de la sesion

## Almacenamiento en el cliente

* localStorage --> accesible via JS y es persistente
* sessionStorage --> util para estados intermedios, se elimina al cerrar la pestaña 
* cookie --> se envía automáticamente en cada petición, puede ser persistente o de sesión, tiene opciones de seguridad (HttpOnly, Secure, SameSite)
variable en memoria de js --> no es persistente
indexDb --> 
