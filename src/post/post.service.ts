import { OkPacket } from 'mysql2/typings/mysql/lib/protocol/packets';
import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';

/**
 * 过滤参数
 */
export interface GetPostOptionsFilter {
  name: string;
  sql?: string;
  param?: string | number;
}
interface GetPostOptions {
  sort?: string;
  filter?: GetPostOptionsFilter;
  pagination?: GetPostOptionsPagination;
  userId?: number;
}

/**
 * 获取文章列表
 */
export interface GetPostOptionsPagination {
  limit: number;
  offset: number;
}

export const getPosts = async (options: GetPostOptions) => {
  const {
    sort,
    filter,
    pagination: { limit, offset },
    userId,
  } = options;
  let params: Array<any> = [limit, offset];
  if (filter.param) {
    params = [filter.param, ...params];
  }
  if (userId) {
    params = [userId, ...params];
  }
  console.log(`params: ${params}`);

  const sql = `
  SELECT 
    post.id, 
    post.content, 
    post.title,
    category.name as category,
    post.views,
    ${sqlFragment.user},
    ${sqlFragment.totalComments},
    ${sqlFragment.coverImage},
    ${sqlFragment.file},
    ${sqlFragment.tags}
    ${userId ? `, ${sqlFragment.liked} ` : ''},
    ${sqlFragment.totalLikes}
  FROM post 
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinOneFile}
    ${sqlFragment.leftJoinCover}
    ${sqlFragment.leftJoinTag}
    ${sqlFragment.leftJoinCategory}
    ${filter.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
  WHERE ${filter.sql}
  GROUP BY post.id
  ORDER BY ${sort}
  LIMIT ?
  OFFSET ?
  `;

  console.log(sql);

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

/**
 * 统计文章总数
 */
export const getPostTotal = async (options: GetPostOptions) => {
  const { filter } = options;
  let params = [filter.param];
  const sql = `
    SELECT 
      COUNT(DISTINCT post.id) AS total
    FROM post 
      ${sqlFragment.leftJoinUser}
      ${sqlFragment.leftJoinOneFile}
      ${sqlFragment.leftJoinTag}
      ${sqlFragment.leftJoinCategory}
      ${filter.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
    WHERE ${filter.sql}
  `;
  const [data] = await connection.promise().query(sql, params);

  return data[0].total;
};

/**
 * 按文章id查询
 */
export const getPostById = async (userId: number, postId: number) => {
  const params = userId ? [userId, postId] : postId;

  const sql = `
    SELECT 
      post.id, 
      post.content, 
      post.title,
      category.name as category,
      post.views,
      ${sqlFragment.user},
      ${sqlFragment.totalComments},
      ${sqlFragment.coverImage},
      ${sqlFragment.file},
      ${sqlFragment.tags}
      ${userId ? `, ${sqlFragment.liked} ` : ''},
      ${sqlFragment.totalLikes}
    FROM post 
      ${sqlFragment.leftJoinUser}
      ${sqlFragment.leftJoinOneFile}
      ${sqlFragment.leftJoinCover}
      ${sqlFragment.leftJoinTag}
      ${sqlFragment.leftJoinCategory}
    WHERE post.id = ?
  `;
  const [data] = await connection.promise().query(sql, params);
  if (!data[0].id) {
    throw new Error('NOT_FOUND');
  }
  return data[0];
};

/**
 * 查看次数
 */
export const createViews = async (postId: number) => {
  const sql = `
    UPDATE post 
    SET views = views + 1
    WHERE id = ?
  `;
  const [data] = await connection.promise().query(sql, postId);

  return (data as OkPacket).changedRows ? true : false;
};
