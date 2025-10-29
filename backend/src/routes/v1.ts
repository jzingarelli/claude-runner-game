import express from 'express';
import { usersRouter } from './v1/users';
import { postsRouter } from './v1/posts';
import { commentsRouter } from './v1/comments';
import { authRouter } from './v1/auth';
import { teamsRouter } from './v1/teams';
import { permissionsRouter } from './v1/permissions';
import { analyticsRouter } from './v1/analytics';
import { reportsRouter } from './v1/reports';
import { notificationsRouter } from './v1/notifications';
import { billingRouter } from './v1/billing';
import { webhooksRouter } from './v1/webhooks';
import { filesRouter } from './v1/files';
import { stripeRouter } from './v1/stripe';

export const v1Router = express.Router();

v1Router.use('/auth', authRouter);

v1Router.use('/users', usersRouter);
v1Router.use('/posts', postsRouter);
v1Router.use('/comments', commentsRouter);

v1Router.use('/analytics', analyticsRouter);
v1Router.use('/reports', reportsRouter);

v1Router.use('/notifications', notificationsRouter);

v1Router.use('/teams', teamsRouter);
v1Router.use('/permissions', permissionsRouter);

v1Router.use('/billing', billingRouter);

v1Router.use('/webhooks', webhooksRouter);
v1Router.use('/files', filesRouter);
v1Router.use('/stripe', stripeRouter);
