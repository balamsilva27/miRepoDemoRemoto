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

function normalizeRoom(payload) {
  const room = typeof payload === 'string' ? payload : payload?.room;
  return typeof room === 'string' ? room.trim() : '';
}

function normalizeText(payload) {
  const text = payload?.text;
  return typeof text === 'string' ? text.trim().slice(0, 1000) : '';
}

function systemMessage(room, text) {
  return {
    id: crypto.randomUUID(),
    type: 'system',
    room,
    text,
    createdAt: new Date().toISOString()
  };
}

async function emitRoomUsers(io, room) {
  const sockets = await io.in(room).fetchSockets();
  const users = sockets
    .map((socket) => socket.data.user)
    .filter(Boolean)
    .map((user) => ({ userId: user.userId, username: user.username }));

  io.to(room).emit('room:users', { room, users });
}

async function leaveCurrentRoom(io, socket, room) {
  const user = memoryStore.getSocketUser(socket.id);
  if (!user || !room) return;

  socket.leave(room);
  memoryStore.setSocketRoom(socket.id, null);
  io.to(room).emit('message:new', systemMessage(room, `${user.username} salio de la sala`));
  await emitRoomUsers(io, room);
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

  io.on('connection', (socket) => {
    memoryStore.addSocket(socket.id, socket.data.user);

    socket.on('room:join', async (payload) => {
      const room = normalizeRoom(payload);
      if (!room) {
        return socket.emit('chat:error', { message: 'Room is required' });
      }

      const user = memoryStore.getSocketUser(socket.id);
      if (!user) return;

      const previousRoom = memoryStore.getSocketRoom(socket.id);
      if (previousRoom && previousRoom !== room) {
        await leaveCurrentRoom(io, socket, previousRoom);
      }

      socket.join(room);
      memoryStore.setSocketRoom(socket.id, room);
      io.to(room).emit('message:new', systemMessage(room, `${user.username} entro a la sala`));
      await emitRoomUsers(io, room);
    });

    socket.on('message:send', (payload) => {
      const room = normalizeRoom(payload);
      const text = normalizeText(payload);
      const user = memoryStore.getSocketUser(socket.id);

      if (!user) return;
      if (!room || !text) {
        return socket.emit('chat:error', { message: 'Room and text are required' });
      }

      const message = {
        id: crypto.randomUUID(),
        type: 'message',
        userId: user.userId,
        username: user.username,
        room,
        text,
        createdAt: new Date().toISOString()
      };

      io.to(room).emit('message:new', message);
    });

    socket.on('disconnect', async () => {
      const user = memoryStore.getSocketUser(socket.id);
      const room = memoryStore.getSocketRoom(socket.id);
      memoryStore.removeSocket(socket.id);

      if (!user || !room) return;

      io.to(room).emit('message:new', systemMessage(room, `${user.username} se desconecto`));
      await emitRoomUsers(io, room);
    });
  });
}
