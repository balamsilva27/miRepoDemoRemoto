const sockets = new Map();

function addSocket(socketId, user) {
  sockets.set(socketId, { user });
}

function removeSocket(socketId) {
  sockets.delete(socketId);
}

function getSocketUser(socketId) {
  return sockets.get(socketId)?.user || null;
}

export default {
  addSocket,
  removeSocket,
  getSocketUser
};
