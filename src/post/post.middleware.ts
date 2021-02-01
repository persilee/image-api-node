import { Request, Response, NextFunction } from 'express';

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
  const { tag, user, action, categoryId } = request.query;

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

  // 按赞筛选
  if (user && action == 'liked' && !tag) {
    request.filter = {
      name: 'userLiked',
      sql: 'user_like_post.userId = ?',
      param: <string>user,
    };
  }

  //按分类筛选
  if (action == 'category') {
    request.filter = {
      name: 'category',
      sql: 'category.id = ?',
      param: parseInt(<string>categoryId, 10),
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
