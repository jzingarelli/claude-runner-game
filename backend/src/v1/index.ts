import { Router } from 'express';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { postsRouter } from './routes/posts';
import { commentsRouter } from './routes/comments';

export const apiV1Router = Router();
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/users', usersRouter);
apiV1Router.use('/posts', postsRouter);
apiV1Router.use('/comments', commentsRouter);
