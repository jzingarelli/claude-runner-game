import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import { swaggerSpec } from '../config/swagger';
import passport from '../config/passport';
import { notFoundHandler, errorHandler } from '../middlewares/errorHandler';
import { v1Router } from '../routes/v1';
import { v2Router } from '../routes/v2';
import { metricsRouter, registerDefaultMetrics } from '../routes/metrics';

export function createApp(): express.Express {
  const app = express();

  // Security and parsing
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  // Passport
  app.use(passport.initialize());

  // Logging
  app.use(morgan('combined'));

  // Basic rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Metrics
  registerDefaultMetrics();
  app.use('/metrics', metricsRouter);

  // API docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Versioned APIs
  app.use('/api/v1', v1Router);
  app.use('/api/v2', v2Router);

  // 404 and error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
