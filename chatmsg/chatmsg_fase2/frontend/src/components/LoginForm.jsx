import { useState } from 'react';

function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) return;

    setLocalError('');
    setIsSubmitting(true);

    try {
      await onLogin(cleanUsername);
    } catch (loginError) {
      setLocalError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login-panel">
      <h1>ChatMSG Fase 2</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="username">Nombre</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Ana"
          autoComplete="name"
          required
        />
        {(localError || error) && <p className="error-message">{localError || error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Conectando...' : 'Crear sesion'}
        </button>
      </form>
    </section>
  );
}

export default LoginForm;
