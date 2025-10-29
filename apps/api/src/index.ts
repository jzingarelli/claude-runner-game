import 'dotenv/config';
import './lib/instrumentation';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';
import { logger } from './lib/logger';
import { connectMongo } from './lib/mongo';
import { redis } from './lib/redis';
import './lib/queue';
import { registerSocketHandlers } from './sockets';
import { apiV1Router } from './routes/v1';
import { errorHandler, notFoundHandler } from './middleware/error';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic rate limiting per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Health
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Versioned API
app.use('/api/v1', apiV1Router);

// Errors
app.use(notFoundHandler);
app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: env.CORS_ORIGIN.split(','), credentials: true },
});
registerSocketHandlers(io);

async function start() {
  try {
    await connectMongo();
    redis.on('error', (err) => logger.error({ msg: 'Redis error', err }));

    server.listen(env.PORT, () => {
      logger.info({ msg: 'API server started', port: env.PORT, env: env.NODE_ENV });
    });
  } catch (err) {
    logger.error({ msg: 'Failed to start server', err });
    process.exit(1);
  }
}

start();
