# ChatMSG Fase 2

Aplicacion de mensajeria en tiempo real con React, Express, Socket.IO, cookies HttpOnly y Redis remoto como pub/sub entre servidores.

## Arquitectura

```text
Usuario A navegador
-> React frontend A
-> Backend Express A
-> Redis remoto pub/sub
-> Backend Express B
-> React frontend B
-> Usuario B navegador
```

Cada companero puede ejecutar su propio backend local, pero todos deben usar el mismo `REDIS_URL`. React nunca se conecta a Redis ni recibe credenciales de Redis.

## Redis y persistencia

Redis se usa solo mediante `@socket.io/redis-adapter` para distribuir eventos de Socket.IO entre backends. El codigo de la app no usa `redis.set`, `redis.get`, `redis.hset`, `redis.lpush` ni comandos equivalentes para guardar datos.

No hay base de datos, archivos JSON, historial permanente ni persistencia en Redis. El estado local por servidor vive en memoria y se pierde al reiniciar el proceso.

## Instalacion backend

```bash
cd chatmsg/chatmsg_fase2/backend
npm install
cp .env.example .env
npm run dev
```

## Instalacion frontend

```bash
cd chatmsg/chatmsg_fase2/frontend
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

Backend (`backend/.env`):

```env
PORT=4001
CLIENT_ORIGIN=http://localhost:5173
REDIS_URL=redis://usuario:password@host:port
SESSION_SECRET=dev_secret_compartido
COOKIE_NAME=chatmsg_session
```

Notas:

- `REDIS_URL` debe apuntar al Redis remoto compartido.
- `SESSION_SECRET` debe ser igual en los servidores que necesiten validar la misma cookie.
- `COOKIE_NAME` debe ser igual en todos los backends.

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:4001
```

Ejemplos validos:

```env
VITE_API_URL=http://localhost:4002
VITE_API_URL=http://IP_DEL_COMPANERO:4001
VITE_API_URL=https://backend-publico-companero.com
```

## Correr un servidor

```bash
cd chatmsg/chatmsg_fase2/backend
PORT=4001 npm run dev
```

## Correr dos servidores en la misma maquina

Terminal 1:

```bash
cd chatmsg/chatmsg_fase2/backend
PORT=4001 npm run dev
```

Terminal 2:

```bash
cd chatmsg/chatmsg_fase2/backend
PORT=4002 npm run dev
```

Ambos procesos deben usar el mismo `REDIS_URL`.

## Probar con companeros

Companero A:

```env
PORT=4001
CLIENT_ORIGIN=http://localhost:5173
REDIS_URL=redis://usuario:password@redis-remoto:port
SESSION_SECRET=dev_secret_compartido
COOKIE_NAME=chatmsg_session
```

Frontend A:

```env
VITE_API_URL=http://localhost:4001
```

Companero B:

```env
PORT=4002
CLIENT_ORIGIN=http://localhost:5173
REDIS_URL=redis://usuario:password@redis-remoto:port
SESSION_SECRET=dev_secret_compartido
COOKIE_NAME=chatmsg_session
```

Frontend B:

```env
VITE_API_URL=http://localhost:4002
```

Prueba:

1. Ambos abren su frontend.
2. Ambos crean sesion con nombres distintos.
3. Ambos entran a la misma sala exacta, por ejemplo `sala-general`.
4. Companero A envia un mensaje.
5. Companero B debe verlo aunque este conectado a otro backend.
6. Companero B responde.
7. Companero A debe verlo.

No debe existir comunicacion directa entre backend A y backend B. La unica comunicacion entre servidores pasa por Redis pub/sub mediante `@socket.io/redis-adapter`.

## Endpoints REST

| Metodo | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/health` | `{ ok, server, port }` |
| `POST` | `/api/session` | Crea cookie HttpOnly y devuelve `{ user }` |
| `GET` | `/api/session` | Devuelve `{ user }` o `{ user: null }` |
| `POST` | `/api/logout` | Limpia cookie y devuelve `{ ok: true }` |

El frontend usa `fetch(..., { credentials: "include" })`. El valor de la cookie HttpOnly nunca se lee desde React.

## Eventos Socket.IO

| Evento | Direccion | Payload |
| --- | --- | --- |
| `connect` | servidor -> cliente | Conexion aceptada por cookie valida |
| `disconnect` | servidor -> cliente | Conexion cerrada |
| `connect_error` | servidor -> cliente | Conexion rechazada por sesion invalida |
| `room:join` | cliente -> servidor | `{ room }` |
| `message:send` | cliente -> servidor | `{ room, text }` |
| `message:new` | servidor -> cliente | Mensaje normal o de sistema |
| `room:users` | servidor -> cliente | `{ room, users }` |

`message:send` usa `io.to(room).emit(...)`, por lo que el mensaje tambien llega al remitente. Con Redis adapter, el evento tambien llega a otros servidores unidos a la misma sala.

## Cookies, CORS y Socket.IO

- Cookie: `httpOnly: true`, `sameSite: "lax"`, `secure: false` en desarrollo.
- Backend CORS: `origin: process.env.CLIENT_ORIGIN`, `credentials: true`.
- Frontend REST: `credentials: "include"`.
- Socket.IO client: `withCredentials: true`.
- No usar `origin: "*"` con credenciales.

Si se usa un balanceador o un solo dominio delante de multiples servidores, Socket.IO puede requerir sticky sessions. Para la prueba entre companeros no hace falta balanceador: cada frontend puede apuntar a su propio backend.

## Problemas comunes

### Los mensajes no llegan entre companeros

Verificar:

- Ambos usan el mismo `REDIS_URL`.
- Ambos entraron a la misma sala exacta.
- Ambos backends estan conectados a Redis.
- No hay errores de CORS.
- El frontend apunta al backend correcto con `VITE_API_URL`.

### Error de cookies o sesion

Verificar:

- `fetch` usa `credentials: "include"`.
- `socket.io-client` usa `withCredentials: true`.
- Backend usa `credentials: true` en CORS.
- `CLIENT_ORIGIN` coincide exactamente con el frontend.
- `SESSION_SECRET` es igual si se comparte cookie entre servidores.

### Error de Redis

Verificar:

- `REDIS_URL` es correcto.
- Redis remoto permite conexiones externas.
- Usuario/password son correctos.
- El proveedor Redis no bloquea la IP.
- Usar TLS en `REDIS_URL` si el proveedor lo requiere.
