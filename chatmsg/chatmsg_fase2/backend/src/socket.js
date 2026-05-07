import crypto from 'crypto';
import { COOKIE_NAME, verifySessionToken } from './session.js';
import memoryStore from './memoryStore.js';

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [name, ...valueParts] = part.trim().split('=');
    if (!name) return cookies;

    cookies[name] = decodeURIComponent(valueParts.join('='));
    return cookies;
  }, {});
}

function normalizeText(payload) {
  const text = typeof payload === 'string' ? payload : payload?.text;
  return typeof text === 'string' ? text.trim().slice(0, 1000) : '';
}

function systemMessage(text) {
  return {
    id: crypto.randomUUID(),
    type: 'system',
    user: 'Sistema',
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

async function emitUsers(io) {
  const sockets = await io.fetchSockets();
  const users = sockets
    .map((socket) => socket.data.user)
    .filter(Boolean)
    .map((user) => ({ userId: user.userId, username: user.username }));

  io.emit('room:users', { users });
}

export function setupSocket(io) {
  io.use((socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const user = verifySessionToken(cookies[COOKIE_NAME]);

    if (!user) {
      return next(new Error('Unauthorized'));
    }

    socket.data.user = { userId: user.userId, username: user.username };
    next();
  });

  io.on('connection', async (socket) => {
    memoryStore.addSocket(socket.id, socket.data.user);

    const user = memoryStore.getSocketUser(socket.id);
    if (user) {
      io.emit('server_message', systemMessage(`${user.username} entro al chat`));
      await emitUsers(io);
    }

    socket.on('client_message', (payload) => {
      const text = normalizeText(payload);
      const user = memoryStore.getSocketUser(socket.id);

      if (!user) return;
      if (!text) {
        return socket.emit('chat:error', { message: 'Text is required' });
      }

      const message = {
        id: crypto.randomUUID(),
        type: 'message',
        user: user.username,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      io.emit('server_message', message);
    });

    socket.on('disconnect', async () => {
      const user = memoryStore.getSocketUser(socket.id);
      memoryStore.removeSocket(socket.id);

      if (!user) return;

      io.emit('server_message', systemMessage(`${user.username} se desconecto`));
      await emitUsers(io);
    });
  });
}
