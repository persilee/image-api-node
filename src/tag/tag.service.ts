import { connection } from '../app/database/mysql';
import { TagModel } from './tag.model';

/**
 * 新增标签
 */
export const createTag = async (tag: TagModel) => {
  const sql = `
    INSERT INTO tag
    SET ?
  `;
  const [data] = await connection.promise().query(sql, tag);

  return data as any;
};

/**
 * 按标签的名字查找
 */
export const findTagByName = async (name: string) => {
  const sql = `
    SELECT * FROM tag
    WHERE name = ?
  `;
  const [data] = await connection.promise().query(sql, name);
  return data[0];
};

/**
 * 新增内容标签
 */
export const createPostTag = async (postId: number, tagId: number) => {
  const sql = `
    INSERT INTO post_tag (postId, tagId)
    VALUES(?, ?)
  `;
  const [data] = await connection.promise().query(sql, [postId, tagId]);

  return data;
};

/**
 * 检查标签
 */
export const postHasTag = async (postId: number, tagId: number) => {
  const sql = `
    SELECT * FROM post_tag
    WHERE postId=? AND tagId=?
  `;
  const [data] = await connection.promise().query(sql, [postId, tagId]);

  return data[0] ? true : false;
};
