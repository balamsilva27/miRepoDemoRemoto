const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export async function createSession(username) {
  const response = await fetch(`${API_URL}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la sesion');
  }

  return response.json();
}

export async function getSession() {
  const response = await fetch(`${API_URL}/api/session`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('No se pudo consultar la sesion');
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('No se pudo cerrar la sesion');
  }

  return response.json();
}
