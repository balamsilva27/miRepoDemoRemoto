import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const SECRET = "supersecreto_pokemon";

export function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: "No autorizado" });
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "pokemon") {
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            maxAge: 3600000 
        });
        return res.json({ message: "Login exitoso", user: username });
    }
    return res.status(401).json({ message: "Credenciales inválidas" });
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout exitoso" });
});

app.get("/verify", auth, (req, res) => {
    res.json({ message: "Autenticado", user: req.user });
});

app.get("/api/pokemon/ejemplo", auth, async (req, res) => {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/pikachu");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Pokémon" });
    }
});

app.get("/api/pokemon/:name", auth, async (req, res) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.name.toLowerCase()}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Pokémon no encontrado" });
    }
});

app.listen(3000, () => {
    console.log("Backend corriendo en http://localhost:3000");
});

