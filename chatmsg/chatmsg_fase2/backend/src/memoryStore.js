const sockets = new Map();

function addSocket(socketId, user) {
  sockets.set(socketId, { user, room: null });
}

function removeSocket(socketId) {
  sockets.delete(socketId);
}

function setSocketRoom(socketId, room) {
  const socketState = sockets.get(socketId);
  if (socketState) {
    socketState.room = room;
  }
}

function getSocketUser(socketId) {
  return sockets.get(socketId)?.user || null;
}

function getSocketRoom(socketId) {
  return sockets.get(socketId)?.room || null;
}

export default {
  addSocket,
  removeSocket,
  setSocketRoom,
  getSocketUser,
  getSocketRoom
};
