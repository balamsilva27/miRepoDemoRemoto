import { useState } from 'react';
import LoginForm from './components/LoginForm';
import ChatRoom from './components/ChatRoom';

function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState('');

  const handleLogin = (username, roomName) => {
    setUser({ username });
    setRoom(roomName);
  };

  const handleLeaveRoom = () => {
    setRoom('');
  };

  const handleLogout = () => {
    setUser(null);
    setRoom('');
  };

  return (
    <div className="app">
      <header>
        <h1>ChatMSG - Fase 1</h1>
        {user && <span className="user-info">{user.username}</span>}
      </header>

      <main>
        {!user ? (
          <LoginForm onLogin={handleLogin} />
        ) : !room ? (
          <div className="join-room">
            <h2>Entrar a una sala</h2>
            <JoinRoomForm onJoin={(roomName) => setRoom(roomName)} />
            <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
          </div>
        ) : (
          <ChatRoom user={user} room={room} onLeave={handleLeaveRoom} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

function JoinRoomForm({ onJoin }) {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      onJoin(roomName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="join-form">
      <input
        type="text"
        placeholder="Nombre de la sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default App;