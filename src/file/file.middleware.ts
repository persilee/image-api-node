import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const fileUpload = multer({
  dest: 'uploads/',
});

export const fileInterceptor = fileUpload.single('file');
