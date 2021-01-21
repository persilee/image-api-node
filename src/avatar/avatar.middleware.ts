import { Request, Response, NextFunction } from 'express';
import Jimp from 'jimp';
import multer from 'multer';
import path from 'path';
import { fileFilter } from '../file/file.middleware';

const avatarUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

const avatarUpload = multer({
  dest: 'uploads/avatar',
  fileFilter: avatarUploadFilter,
});

export const avatarInterceptor = avatarUpload.single('avatar');

/**
 * 头像处理
 * @param request
 * @param response
 * @param next
 */
export const avatarProcessor = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { file } = request;
  const filePath = path.join(file.destination, 'resized', file.filename);

  try {
    const image = await Jimp.read(file.path);
    image.cover(256, 256).quality(86).write(`${filePath}-large`);
    image.cover(128, 128).quality(86).write(`${filePath}-medium`);
    image.cover(64, 64).quality(86).write(`${filePath}-small`);
  } catch (error) {
    next(error);
  }
  next();
};
