import { createClient } from 'redis';

let pubClient;
let subClient;

export async function createRedisClients() {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is required');
  }

  pubClient = createClient({ url: process.env.REDIS_URL });
  subClient = pubClient.duplicate();

  pubClient.on('error', (err) => console.error('Redis pub client error:', err));
  subClient.on('error', (err) => console.error('Redis sub client error:', err));

  await pubClient.connect();
  await subClient.connect();

  return { pubClient, subClient };
}

export { pubClient, subClient };
