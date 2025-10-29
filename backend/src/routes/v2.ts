import express from 'express';
import { v2AnalyticsRouter } from './v2/analytics';

export const v2Router = express.Router();

v2Router.use('/analytics', v2AnalyticsRouter);
