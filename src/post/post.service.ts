import { OkPacket } from 'mysql2/typings/mysql/lib/protocol/packets';
import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';

/**
 * 获取文章列表
 */
export const getPosts = async () => {
  const sql = `SELECT 
    post.id, 
    post.content, 
    post.title,
    JSON_OBJECT(
      'id', user.id,
      'name', user.name
    ) as user
  FROM post 
  LEFT JOIN user 
    ON user.id = post.userId`;
  const [data] = await connection.promise().query(sql);
  return data;
};

/**
 * 新增文章
 */
export const createPost = async (post: PostModel) => {
  const sql = `
    INSERT INTO post
      SET ?
  `;
  let [data] = await connection.promise().query(sql, post);
  if (data) {
    let result: OkPacket = <OkPacket>data;
    [data] = await connection
      .promise()
      .query(`select * from post where id = ?`, result.insertId);
  }
  console.log(typeof data);

  return data;
};

/**
 * 更新文章
 */
export const updatePost = async (postId: number, post: PostModel) => {
  const sql = `
    UPDATE post
      SET ?
    WHERE id = ?
  `;
  let [data] = await connection.promise().query(sql, [post, postId]);
  if (data) {
    [data] = await connection
      .promise()
      .query(`select * from post where id = ?`, postId);
  }
  return data;
};

/**
 * 删除文章
 */
export const deletePost = async (postId: number) => {
  const sql = `
    DELETE FROM post
    WHERE id = ?
  `;
  let [data] = await connection.promise().query(sql, postId);
  return data;
};
