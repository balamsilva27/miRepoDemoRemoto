import { useState } from 'react';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UsersList from './UsersList';

function ChatRoom({
  user,
  connected,
  room,
  messages,
  users,
  error,
  onJoinRoom,
  onSendMessage,
  onLogout
}) {
  const [roomInput, setRoomInput] = useState(room || 'sala-general');

  function handleJoin(event) {
    event.preventDefault();
    onJoinRoom(roomInput);
  }

  return (
    <section className="chat-layout">
      <header className="chat-header">
        <div>
          <h1>ChatMSG Fase 2</h1>
          <p>{user.username} · {connected ? 'conectado' : 'desconectado'}</p>
        </div>
        <button type="button" className="secondary-button" onClick={onLogout}>
          Cerrar sesion
        </button>
      </header>

      <form className="room-form" onSubmit={handleJoin}>
        <label htmlFor="room">Sala</label>
        <input
          id="room"
          type="text"
          value={roomInput}
          onChange={(event) => setRoomInput(event.target.value)}
          placeholder="sala-general"
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="chat-grid">
        <div className="messages-panel">
          <div className="room-title">{room ? `Sala actual: ${room}` : 'Entra a una sala'}</div>
          <MessageList messages={messages} />
          <MessageInput disabled={!room || !connected} onSend={onSendMessage} />
        </div>
        <UsersList users={users} />
      </div>
    </section>
  );
}

export default ChatRoom;
