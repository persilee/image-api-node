import express from 'express';
import cors from 'cors';
import { defaultErrorHandler } from './app.middleware';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import likeRouter from '../like/like.router';
import { currentUser } from '../auth/auth.middleware';
import categoryRouter from '../category/category.router';

const app = express();
app.use(cors());
app.use(express.json());
app.use(currentUser);
app.use(
  categoryRouter,
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  likeRouter,
);
app.use(defaultErrorHandler);

export default app;
