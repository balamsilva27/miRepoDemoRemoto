import { useState, useEffect } from 'react';
import { socket } from '../socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UsersList from './UsersList';

function ChatRoom({ user, room, onLeave, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit('room:join', room);

    socket.on('message:history', (msgs) => {
      setMessages(msgs);
    });

    socket.on('message:new', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('room:users', (roomUsers) => {
      setUsers(roomUsers);
    });

    return () => {
      socket.off('message:history');
      socket.off('message:new');
      socket.off('room:users');
    };
  }, [room]);

  const handleSendMessage = (text) => {
    socket.emit('message:send', { room, text });
  };

  const handleLeave = () => {
    socket.emit('room:leave', room);
    onLeave();
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <span>Sala: {room}</span>
        <div className="chat-actions">
          <button onClick={handleLeave} className="btn-leave">Salir de la sala</button>
          <button onClick={onLogout} className="btn-logout">Cerrar sesión</button>
        </div>
      </div>

      <div className="chat-content">
        <div className="messages-area">
          <MessageList messages={messages} currentUser={user.username} />
          <MessageInput onSend={handleSendMessage} />
        </div>
        <UsersList users={users} />
      </div>
    </div>
  );
}

export default ChatRoom;