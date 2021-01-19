import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { accessControl, authGuard } from '../auth/auth.middleware';

/**
 * 路由
 */
const router = express.Router();

/**
 * 获取文章列表
 */
router.get('/posts', requestUrl, postController.index);

/**
 * 新增文章
 */
router.post('/posts', authGuard, postController.store);

/**
 * 更新文章
 */
router.patch(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.update,
);

/**
 * 删除文章
 */
router.delete(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.remove,
);

export default router;
