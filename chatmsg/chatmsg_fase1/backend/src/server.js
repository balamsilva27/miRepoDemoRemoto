import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocket } from './socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ChatMSG Fase 1 Backend' });
});

const io = new Server(httpServer, {
  cors: corsOptions
});

setupSocket(io);

const PORT = process.env.PORT || 4001;
httpServer.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Cliente permitido: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
});