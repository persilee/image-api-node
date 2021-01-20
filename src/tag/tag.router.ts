import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as tagController from './tag.controller';

const router = express.Router();

router.post('/tags', authGuard, tagController.store);

export default router;
