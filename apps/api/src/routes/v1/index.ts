import { Router } from 'express';
import { usersRouter } from './users';
import { postsRouter } from './posts';
import { commentsRouter } from './comments';
import { authRouter } from './auth';

export const apiV1Router = Router();

apiV1Router.use('/auth', authRouter);
apiV1Router.use('/users', usersRouter);
apiV1Router.use('/posts', postsRouter);
apiV1Router.use('/comments', commentsRouter);
