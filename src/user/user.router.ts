import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as userController from './user.controller';
import {
  hashPassword,
  validateUpdateUser,
  validateUser,
} from './user.middleware';

const router = express.Router();

/**
 * 新增用户
 */
router.post('/users', validateUser, hashPassword, userController.store);

/**
 * 根据ID获取用户
 */
router.get('/users/:userId', userController.show);

/**
 * 更新用户
 */
router.patch('/users', authGuard, validateUpdateUser, userController.update);

export default router;
