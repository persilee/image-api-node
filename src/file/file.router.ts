import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import { fileInterceptor, fileProcessor } from './file.middleware';

const router = express.Router();

//文件上传
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  fileController.store,
);

//获取文件
router.get('/files/:fileId/serve', fileController.serve);

//文件信息
router.get('/files/:fileId/metadata', fileController.metadata);

export default router;
