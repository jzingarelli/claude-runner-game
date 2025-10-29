import express from 'express';
import client from 'prom-client';

export const metricsRouter = express.Router();

export function registerDefaultMetrics() {
  client.collectDefaultMetrics();
}

metricsRouter.get('/', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
