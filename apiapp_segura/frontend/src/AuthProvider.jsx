import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true; // Para enviar cookies

  useEffect(() => {
    // Verificar si hay sesión activa
    axios.get('http://localhost:3000/verify')
      .then(res => {
        setUser(res.data.user.username);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:3000/login', { username, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('http://localhost:3000/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
