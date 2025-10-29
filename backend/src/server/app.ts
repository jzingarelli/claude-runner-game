import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectMongo } from './db';
import { initQueues } from './queue';
import { apiV1Router } from '../v1';
import { errorHandler } from './errorHandler';
import { rateLimiter } from './rateLimiter';
import { logger } from './logger';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(rateLimiter);

connectMongo().catch((err) => {
  logger.error('Mongo connection failed', { err });
});

initQueues();

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api/v1', apiV1Router);

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.warn('Not found', { path: req.path });
  next({ status: 404, message: 'Not found' });
});

app.use(errorHandler);

export default app;
