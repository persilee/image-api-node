import express from 'express';
import { accessControl, authGuard } from '../auth/auth.middleware';
import * as commentController from './comment.controller';
import { filter } from './comment.middleware';

const router = express.Router();

router.get('/comments', filter, commentController.index);

router.post('/comments', authGuard, commentController.store);

router.post('/comments/:commentId/reply', authGuard, commentController.reply);

router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentController.update,
);

router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentController.destroy,
);

export default router;
