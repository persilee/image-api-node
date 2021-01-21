import { connection } from '../app/database/mysql';

/**
 * 点赞文章
 */
export const createUserLikePost = async (userId: number, postId: number) => {
  const sql = `
    INSERT INTO user_like_post(userId, postId)
    VALUES(?, ?)
  `;
  const [data] = await connection.promise().query(sql, [userId, postId]);

  return data;
};

/**
 * 取消点赞
 */
export const deleteLikePost = async (userId: number, postId: number) => {
  const sql = `
    DELETE FROM user_like_post
    WHERE userId = ? AND  postId = ?
  `;
  const [data] = await connection.promise().query(sql, [userId, postId]);

  return data;
};
