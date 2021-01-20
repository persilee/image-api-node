import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';

/**
 * 文件上传
 * @param request
 * @param response
 * @param next
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id: userId } = request.user;
  const { post } = request.query;
  const postId = parseInt(<string>post, 10);
  const fileInfo = _.pick(request.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);

  try {
    const data = await createFile({
      ...fileInfo,
      userId,
      postId,
      ...request.fileMetaData,
    });
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取文件
 * @param request
 * @param response
 * @param next
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { fileId } = request.params;
  try {
    const file = await findFileById(parseInt(fileId, 10));
    const { size } = request.query;
    let filename = file.filename;
    let root = 'uploads';
    let resized = 'resized';
    if (size) {
      const imageSizes = ['large', 'medium', 'thumbnail'];
      if (!imageSizes.some((item) => item == size)) {
        throw new Error('FILE_NOT_FOUND');
      }
      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`),
      );
      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }
    response.sendFile(filename, {
      root: root,
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 文件信息
 */
export const metadata = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { fileId } = request.params;
  try {
    const file = await findFileById(parseInt(fileId, 10));
    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);
    response.send(data);
  } catch (error) {
    next(error);
  }
};
