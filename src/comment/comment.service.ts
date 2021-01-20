import { connection } from '../app/database/mysql';
import { CommentModel } from './comment.model';

/**
 * 添加评论
 */
export const createComment = async (comment: CommentModel) => {
  const sql = `
    INSERT INTO comment
    SET ?
  `;

  const [data] = await connection.promise().query(sql, comment);

  return data;
};

/**
 * 检查评论
 */
export const isReplyComment = async (commentId: number) => {
  const sql = `
    SELECT parentId FROM comment
    WHERE id = ?
  `;
  const [data] = await connection.promise().query(sql, commentId);

  return data[0].parentId ? true : false;
};

/**
 * 修改评论
 */
export const updateComment = async (comment: CommentModel) => {
  const { id, content } = comment;
  const sql = `
    UPDATE comment
    SET  content = ?
    WHERE id = ?
  `;
  const [data] = await connection.promise().query(sql, [content, id]);

  return data;
};

/**
 * 删除评论
 */
export const deleteComment = async (commentId: number) => {
  const sql = `
    DELETE FROM comment
    WHERE id = ? 
  `;
  const [data] = await connection.promise().query(sql, commentId);

  return data;
};
