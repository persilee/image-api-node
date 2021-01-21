import { Request, Response, NextFunction } from 'express';
import { eq } from 'lodash';
import { POSTS_PER_PAGE } from '../app/app.config';

/**
 * 排序方式
 * @param request
 * @param response
 * @param next
 */
export const sort = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { sort } = request.query;
  let sqlSort: string;
  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'latest':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC, post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  request.sort = sqlSort;

  next();
};

/**
 * 筛选文章
 * @param request
 * @param response
 * @param next
 */
export const filter = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { tag, user, action } = request.query;

  request.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  };

  // 按标签名筛选
  if (tag && !user && !action) {
    request.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: <string>tag,
    };
  }

  // 按用户筛选
  if (user && action == 'published' && !tag) {
    request.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: <string>user,
    };
  }

  next();
};

/**
 * 列表分页
 * @param request
 * @param response
 * @param next
 */
export const pagination = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  let { pageIndex = 1, pageSize = 10 } = request.query;
  const limit = parseInt(<string>pageSize, 10);
  const offset = limit * (parseInt(<string>pageIndex, 10) - 1);
  request.pagination = { limit, offset };

  next();
};
