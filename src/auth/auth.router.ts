import express from 'express';
import * as authController from './auth.controller';
import { authGuard, validateLogin } from './auth.middleware';

const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/auth/validate', authGuard, authController.validate);

export default router;
