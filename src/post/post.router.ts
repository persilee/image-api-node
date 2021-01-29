import express from 'express';
import * as postController from './post.controller';
import { filter, pagination, sort } from './post.middleware';
import { accessControl, authGuard } from '../auth/auth.middleware';

/**
 * 路由
 */
const router = express.Router();

/**
 * 获取文章列表
 */
router.get('/posts', sort, filter, pagination, postController.index);

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

router.post(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.storePostTag,
);

router.delete(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.destroyPostTag,
);

/**
 * 根据id获取文章
 */
router.get('/posts/:postId', postController.show);

export default router;
