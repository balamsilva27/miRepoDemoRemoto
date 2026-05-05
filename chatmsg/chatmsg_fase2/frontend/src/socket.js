import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export function createChatSocket() {
  return io(API_URL, {
    withCredentials: true,
    autoConnect: false
  });
}
