import { connection } from '../app/database/mysql';
import { AvatarModel } from './avatar.model';

/**
 * 保存头像
 */
export const createAvatar = async (avatar: AvatarModel) => {
  const sql = `
    INSERT INTO avatar
    SET ?
  `;
  const [data] = await connection.promise().query(sql, avatar);

  return data;
};

/**
 * 按用户查找头像
 */
export const findAvatarByUserId = async (userId: number) => {
  const sql = `
    SELECT * FROM avatar
    WHERE userId = ?
    ORDER BY avatar.id DESC
    LIMIT 1
  `;
  const [data] = await connection.promise().query(sql, userId);

  return data[0];
};
