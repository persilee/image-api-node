import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { imageReSize } from './file.service';

const fileUpload = multer({
  dest: 'uploads/',
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
