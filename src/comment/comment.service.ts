import { connection } from '../app/database/mysql';
import {
  GetPostOptionsFilter,
  GetPostOptionsPagination,
} from '../post/post.service';
import { CommentModel } from './comment.model';
import { sqlFragment } from './comment.provider';

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

/**
 * 评论过滤参数
 */
interface GetCommentOptions {
  filter?: GetPostOptionsFilter;
  pagination?: GetPostOptionsPagination;
}
/**
 * 获取评论列表
 */
export const getComments = async (options: GetCommentOptions) => {
  const {
    filter,
    pagination: { limit, offset },
  } = options;
  let params: Array<any> = [limit, offset];
  if (filter.param) {
    params = [filter.param, ...params];
  }

  const sql = `
    SELECT 
      comment.id,
      comment.content,
      comment.createdAt,
      comment.updatedAt,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${filter.name == 'userReplied' ? `, ${sqlFragment.repliedComment}` : ''}
      ${filter.name != 'userReplied' ? `, ${sqlFragment.totalReplies}` : ''}
    FROM comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
    GROUP BY comment.id
    ORDER BY comment.id DESC
    LIMIT ?
    OFFSET ?
  `;
  const [data] = await connection.promise().query(sql, params);

  return data;
};

/**
 * 统计评论总数
 */
export const getCommentTotal = async (options: GetCommentOptions) => {
  const { filter } = options;
  let params: Array<any> = [];
  if (filter.param) {
    params = [filter.param, ...params];
  }
  const sql = `
    SELECT 
      COUNT(
        DISTINCT comment.id
      ) as total
    FROM comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
  `;
  const [data] = await connection.promise().query(sql, params);

  return data[0].total;
};

/**
 * 查询评论回复列表
 */
export const getCommentReplies = async (commentId: number) => {
  const sql = `
    SELECT 
      comment.id,
      comment.content,
      comment.createdAt,
      comment.updatedAt,
      ${sqlFragment.user}
    FROM comment
    ${sqlFragment.leftJoinUser}
    WHERE comment.parentId = ?
    GROUP BY comment.id
  `;
  const [data] = await connection.promise().query(sql, commentId);

  return data;
};
