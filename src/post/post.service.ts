import { connection } from '../app/database/mysql';

export const getPosts = async () => {
  const sql = `SELECT user.name, post.content, post.title FROM post LEFT JOIN user ON user.id = post.user_id`;
  const [data] = await connection.promise().query(sql);
  return data;
};
