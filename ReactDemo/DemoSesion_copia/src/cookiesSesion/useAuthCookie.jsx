import { useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "./cookies";

export function useAuthCookie() {
    const [token, setToken] = useState(null);
    
    useEffect(()=> {
        const saved = getCookie('token');
        if(saved) setToken(saved);
    },[]);
    
    const login = () => {
        const fakenToken = "123ab";
        setCookie('token', fakenToken);
        setToken(fakenToken);
    }

    const logout = () => {
        deleteCookie('token');
        setToken(null);
    }

    return { token, login, logout };
    
}