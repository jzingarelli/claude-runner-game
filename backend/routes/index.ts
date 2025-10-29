/**
 * Main Routes Index
 * Aggregates all route modules
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import analyticsRoutes from './analyticsRoutes';
import reportRoutes from './reportRoutes';
import teamRoutes from './teamRoutes';
import commentRoutes from './commentRoutes';
import notificationRoutes from './notificationRoutes';
import webhookRoutes from './webhookRoutes';
import subscriptionRoutes from './subscriptionRoutes';

const router = Router();

/**
 * API v1 routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/teams', teamRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/subscriptions', subscriptionRoutes);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
  });
});

export default router;
