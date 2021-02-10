import { Request, Response, NextFunction } from 'express';

/**
 * 评论过滤器
 * @param request
 * @param response
 * @param next
 */
export const filter = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { post, user, action } = request.query;

  request.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };

  if (post && !user && !action) {
    request.filter = {
      name: 'postComments',
      sql: 'comment.postId = ?',
      param: <string>post,
    };
  }

  if (user && action == 'published' && !post) {
    request.filter = {
      name: 'userPublished',
      sql: 'comment.parentId IS NULL AND comment.userId = ?',
      param: <string>user,
    };
  }

  if (user && action == 'replied' && !post) {
    request.filter = {
      name: 'userReplied',
      sql: 'comment.parentId IS NOT NULL AND comment.userId = ?',
      param: <string>user,
    };
  }

  next();
};
