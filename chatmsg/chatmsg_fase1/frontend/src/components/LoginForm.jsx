import { useState } from 'react';
import { socket } from '../socket';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      socket.connect();
      socket.emit('user:join', { username });
      onLogin(username, room);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Iniciar sesión</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Tu nombre"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Nombre de la sala"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
      </div>
      <button type="submit">Conectar</button>
    </form>
  );
}

export default LoginForm;