import express from 'express';
import { defaultErrorHandler } from './app.middleware';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';

const app = express();
app.use(express.json());
app.use(postRouter, userRouter, authRouter, fileRouter, tagRouter);
app.use(defaultErrorHandler);

export default app;
