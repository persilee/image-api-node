import express from 'express';
import * as userController from './user.controller';
import { hashPassword, validateUser } from './user.middleware';

const router = express.Router();

/**
 * 新增用户
 */
router.post('/users', validateUser, hashPassword, userController.store);

export default router;
