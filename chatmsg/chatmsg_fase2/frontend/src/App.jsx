import { useEffect, useRef, useState } from 'react';
import { createSession, getSession, logout } from './api';
import { createChatSocket } from './socket';
import LoginForm from './components/LoginForm';
import ChatRoom from './components/ChatRoom';

function App() {
  const socketRef = useRef(null);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function connectSocket() {
    if (socketRef.current) {
      return socketRef.current;
    }

    const nextSocket = createChatSocket();
    socketRef.current = nextSocket;
    setSocket(nextSocket);
    return nextSocket;
  }

  useEffect(() => {
    let isMounted = true;

    getSession()
      .then(({ user: sessionUser }) => {
        if (!isMounted) return;
        if (sessionUser) {
          setUser(sessionUser);
          connectSocket();
        }
      })
      .catch((sessionError) => {
        if (isMounted) {
          setError(sessionError.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    function handleConnect() {
      setConnected(true);
      setError('');
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function handleConnectError(connectError) {
      setConnected(false);
      setError(connectError.message || 'No se pudo conectar al chat');
    }

    function handleMessage(message) {
      setMessages((currentMessages) => [...currentMessages, message]);
    }

    function handleRoomUsers(payload) {
      setUsers(payload.users || []);
    }

    function handleHistory(history) {
      setMessages(history);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('server_history', handleHistory);
    socket.on('server_message', handleMessage);
    socket.on('room:users', handleRoomUsers);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('server_history', handleHistory);
      socket.off('server_message', handleMessage);
      socket.off('room:users', handleRoomUsers);
    };
  }, [socket]);

  async function handleLogin(username) {
    setError('');
    const response = await createSession(username);
    setUser(response.user);
    connectSocket();
  }

  function handleSendMessage(text) {
    if (!socket) return;
    socket.emit('client_message', { text });
  }

  async function handleLogout() {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(null);
    setConnected(false);
    setMessages([]);
    setUsers([]);
    setUser(null);
    await logout();
  }

  if (loading) {
    return <main className="app-shell">Cargando...</main>;
  }

  return (
    <main className="app-shell">
      {!user ? (
        <LoginForm onLogin={handleLogin} error={error} />
      ) : (
        <ChatRoom
          user={user}
          connected={connected}
          messages={messages}
          users={users}
          error={error}
          onSendMessage={handleSendMessage}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}

export default App;
