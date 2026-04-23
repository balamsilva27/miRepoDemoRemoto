import { useState } from "react";

export default function AppCookieHttpOnly() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("12345");
    const [mensaje, setMensaje] = useState("");

    const login = async () => {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });

        const data = await response.json();
        setMensaje(data.message || "Login exitoso");

    };

    const logout = async () => {
        const res = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include",
        });
        const data = await res.json();
        setMensaje(data.message || "Logout exitoso");
    }

    const obtenerPerfil = async () => {
        const res = await fetch("http://localhost:3000/perfil", {
            credentials: "include",
        });
        const data = await res.json();
        setMensaje(data.message || "Perfil obtenido");
    };

    return (
        <div>
            <h2>Autenticacion con Cookies HttpOnly</h2>

            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />

            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />

            <button onClick={login}>Login</button>
            <button onClick={obtenerPerfil}>Obtener Perfil</button>
            <button onClick={logout}>Logout</button>
            <div>
                <strong>Respuesta:</strong><p>{mensaje}</p>
            </div>

        </div>


    )


}
        