import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as avatarController from './avatar.controller';
import { avatarInterceptor, avatarProcessor } from './avatar.middleware';

const router = express.Router();

router.post(
  '/avatar',
  authGuard,
  avatarInterceptor,
  avatarProcessor,
  avatarController.store,
);

router.get('/avatar/:userId', avatarController.serve);

export default router;
