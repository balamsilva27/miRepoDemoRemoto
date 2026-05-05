import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createAdapter } from '@socket.io/redis-adapter';
import { createRedisClients } from './redis.js';
import { clearSessionCookie, getSessionFromRequest, setSessionCookie } from './session.js';
import { setupSocket } from './socket.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const corsOptions = {
  origin: CLIENT_ORIGIN,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ ok: true, server: 'chatmsg_fase2', port: Number(PORT) });
});

app.post('/api/session', (req, res) => {
  const username = req.body.username?.trim();
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  const user = {
    userId: crypto.randomUUID(),
    username,
    createdAt: new Date().toISOString()
  };

  setSessionCookie(res, user);
  res.json({ user: { userId: user.userId, username: user.username } });
});

app.get('/api/session', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.json({ user: null });
  }

  res.json({ user: { userId: session.userId, username: session.username } });
});

app.post('/api/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

async function startServer() {
  try {
    const { pubClient, subClient } = await createRedisClients();
    const io = new Server(server, {
      cors: {
        origin: CLIENT_ORIGIN,
        credentials: true
      }
    });

    io.adapter(createAdapter(pubClient, subClient));
    setupSocket(io);

    server.listen(PORT, () => {
      console.log(`chatmsg_fase2 backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting chatmsg_fase2 backend:', error);
    process.exit(1);
  }
}

startServer();
