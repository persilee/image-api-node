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
  request.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };

  next();
};
