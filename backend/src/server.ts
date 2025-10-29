import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app/app';
import { connectMongo } from './config/mongo';
import { getRedis } from './config/redis';
import { env } from './config/env';
import { logger } from './config/logger';

async function main() {
  await connectMongo();
  getRedis();

  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: true, credentials: true } });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
  });

  const port = Number(env.PORT);
  server.listen(port, () => {
    logger.info(`API server listening on port ${port}`);
  });
}

main().catch((err) => {
  logger.error(`Fatal error: ${(err as Error).message}`);
  process.exit(1);
});
