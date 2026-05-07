import memoryStore from './memoryStore.js';

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('user:join', (userData) => {
      const user = {
        id: socket.id,
        username: userData.username,
        socketId: socket.id
      };
      memoryStore.addUser(socket.id, user);
      socket.emit('user:joined', user);
      console.log(`Usuario unido: ${user.username}`);
    });

    socket.on('room:join', (roomName) => {
      const user = memoryStore.getUser(socket.id);
      if (!user) return;

      socket.join(roomName);
      memoryStore.joinRoom(roomName, socket.id);

      const users = memoryStore.getRoomUsers(roomName);
      const messages = memoryStore.getMessages(roomName).filter(m => m.type !== 'system');

      io.to(roomName).emit('room:users', users);
      io.to(roomName).emit('message:history', messages);

      const systemMessage = {
        type: 'system',
        text: `${user.username} entró a la sala`,
        timestamp: new Date().toISOString()
      };
      io.to(roomName).emit('message:new', systemMessage);

      console.log(`Usuario ${user.username} entró a la sala: ${roomName}`);
    });

    socket.on('message:send', ({ room, text }) => {
      const user = memoryStore.getUser(socket.id);
      if (!user) return;

      const message = {
        id: Date.now().toString(),
        type: 'user',
        text: text,
        username: user.username,
        timestamp: new Date().toISOString()
      };

      memoryStore.addMessage(room, message);
      io.to(room).emit('message:new', message);
    });

    socket.on('room:leave', (roomName) => {
      const user = memoryStore.getUser(socket.id);
      if (!user) return;

      socket.leave(roomName);
      memoryStore.leaveRoom(roomName, socket.id);

      const users = memoryStore.getRoomUsers(roomName);
      io.to(roomName).emit('room:users', users);

      const systemMessage = {
        type: 'system',
        text: `${user.username} salió de la sala`,
        timestamp: new Date().toISOString()
      };
      io.to(roomName).emit('message:new', systemMessage);
    });

    socket.on('disconnect', () => {
      const user = memoryStore.getUser(socket.id);
      if (user) {
        memoryStore.removeUser(socket.id);
        console.log(`Usuario desconectado: ${user.username}`);
      }
    });
  });
}