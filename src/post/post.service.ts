import { OkPacket } from 'mysql2/typings/mysql/lib/protocol/packets';
import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';

/**
 * 获取文章列表
 */
export interface GetPostOptionsFilter {
  name: string;
  sql?: string;
  param?: string;
}
interface GetPostOptions {
  sort?: string;
  filter?: GetPostOptionsFilter;
}

export interface GetPostOptionsPagination {
  limit: number;
  offset: number;
}

export const getPosts = async (options: GetPostOptions) => {
  const { sort, filter } = options;
  let params: Array<any> = [];
  if (filter.param) {
    params = [filter.param, ...params];
  }
  const sql = `
  SELECT 
    post.id, 
    post.content, 
    post.title,
    ${sqlFragment.user},
    ${sqlFragment.totalComments},
    ${sqlFragment.file},
    ${sqlFragment.tags}
  FROM post 
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinOneFile}
    ${sqlFragment.leftJoinTag}
  WHERE ${filter.sql}
  GROUP BY post.id
  ORDER BY ${sort}
  `;
  const [data] = await connection.promise().query(sql, params);
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

/**
 * 删除文章标签
 */
export const deletePostTag = async (postId: number, tagId: number) => {
  const sql = `
    DELETE FROM post_tag
    WHERE postId = ? AND tagId = ?
  `;
  const [data] = await connection.promise().query(sql, [postId, tagId]);

  return data;
};
