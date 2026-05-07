const rooms = new Map();
const users = new Map();
const messagesByRoom = new Map();

function createRoom(name) {
  if (!rooms.has(name)) {
    rooms.set(name, new Set());
    messagesByRoom.set(name, []);
  }
}

function joinRoom(roomName, userId) {
  createRoom(roomName);
  rooms.get(roomName).add(userId);
}

function leaveRoom(roomName, userId) {
  if (rooms.has(roomName)) {
    rooms.get(roomName).delete(userId);
  }
}

function getRoomUsers(roomName) {
  if (!rooms.has(roomName)) return [];
  const userIds = Array.from(rooms.get(roomName));
  return userIds.map(id => users.get(id)).filter(Boolean);
}

function addUser(userId, userData) {
  users.set(userId, userData);
}

function removeUser(userId) {
  for (const roomName of rooms.keys()) {
    leaveRoom(roomName, userId);
  }
  users.delete(userId);
}

function getUser(userId) {
  return users.get(userId);
}

function addMessage(roomName, message) {
  if (!messagesByRoom.has(roomName)) {
    messagesByRoom.set(roomName, []);
  }
  const messages = messagesByRoom.get(roomName);
  messages.push(message);
  if (messages.length > 100) {
    messages.shift();
  }
}

function getMessages(roomName) {
  return messagesByRoom.get(roomName) || [];
}

export default {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomUsers,
  addUser,
  removeUser,
  getUser,
  addMessage,
  getMessages
};