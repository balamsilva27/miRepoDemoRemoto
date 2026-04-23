import { useAuthCookie } from "./useAuthCookie";

export function AppCookie() {
    const { token, login, logout } = useAuthCookie();

    return (
        <div>
            <h3>Auth con Cookies</h3>
            {token ? (
                <>
                    <p>Sesion Activa</p>
                    <button onClick={logout}>Cerrar Sesion</button>
                </>
            ) : (
                <>
                    <p>Sesion Inactiva</p>
                    <button onClick={login}>Iniciar Sesion</button>
                </>
            )}
        </div>
    );

}