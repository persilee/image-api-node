import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import Jimp from 'jimp';
import { imageReSize } from './file.service';

/**
 * 文件过滤
 * @param fileTypes
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    _request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowed = fileTypes.some((type) => type === file.mimetype);

    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

const fileUploadFilter = fileFilter([
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
]);

const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
});

export const fileInterceptor = fileUpload.single('file');

/**
 * 处理文件
 * @param request
 * @param _response
 * @param next
 */
export const fileProcessor = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { path } = request.file;
  let image: Jimp;
  try {
    image = await Jimp.read(path);
  } catch (error) {
    return next(error);
  }
  //添加文件信息
  const exif = image['_exif'];
  if (exif) {
    const { imageSize, tags } = exif;
    request.fileMetaData = {
      width: imageSize.width,
      height: imageSize.height,
      metadata: JSON.stringify(tags),
    };
    //调整文件尺寸
    imageReSize(image, request.file);
  }
  next();
};
