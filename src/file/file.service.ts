import Jimp from 'jimp';
import path from 'path';
import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';

/**
 * 保存文件信息
 */
export const createFile = async (file: FileModel) => {
  const sql = `
    INSERT INTO file
    SET ?
  `;

  const [data] = await connection.promise().query(sql, file);

  return data;
};

/**
 * 根据 id 查找文件
 */
export const findFileById = async (fileId: number) => {
  const sql = `
    SELECT * FROM file WHERE id = ?
  `;
  const [data] = await connection.promise().query(sql, fileId);

  return data[0];
};

/**
 * 调整图像尺寸
 */
export const imageReSize = async (image: Jimp, file: Express.Multer.File) => {
  const { imageSize } = image['_exif'];
  const filePath = path.join(file.destination, 'resized', file.filename);
  if (imageSize.width > 1280) {
    image.resize(1280, Jimp.AUTO).quality(86).write(`${filePath}-large`);
  }
  if (imageSize.width > 640) {
    image.resize(640, Jimp.AUTO).quality(86).write(`${filePath}-medium`);
  }
  if (imageSize.width > 320) {
    image.resize(320, Jimp.AUTO).quality(86).write(`${filePath}-thumbnail`);
  }
};
