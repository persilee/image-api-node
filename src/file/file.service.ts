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
