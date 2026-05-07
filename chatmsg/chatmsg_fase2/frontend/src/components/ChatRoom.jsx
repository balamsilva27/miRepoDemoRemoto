import MessageInput from './MessageInput';
import MessageList from './MessageList';
import UsersList from './UsersList';

function ChatRoom({
  user,
  connected,
  messages,
  users,
  error,
  onSendMessage,
  onLogout
}) {
  return (
    <section className="chat-layout">
      <header className="chat-header">
        <div>
          <h1>ChatMSG Fase 2</h1>
          <p>{user.username} - {connected ? 'conectado' : 'desconectado'}</p>
        </div>
        <button type="button" className="secondary-button" onClick={onLogout}>
          Cerrar sesion
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="chat-grid">
        <div className="messages-panel">
          <MessageList messages={messages} />
          <MessageInput disabled={!connected} onSend={onSendMessage} />
        </div>
        <UsersList users={users} />
      </div>
    </section>
  );
}

export default ChatRoom;
