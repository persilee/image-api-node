import { Request, Response, NextFunction } from 'express';

/**
 * 拦截rul
 * @param request
 * @param response
 * @param next
 */
export const requestUrl = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  console.log(request.url);
  next();
};

/**
 * 异常处理
 * @param error
 * @param request
 * @param response
 * @param next
 */
export const defaultErrorHandler = (
  error: any,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error.message) {
    console.log(`🤔 ${error.message}`);
  }
  let statusCode: number, message: string;
  switch (error.message) {
    case 'NAME_IS_REQUIRED':
      statusCode = 400;
      message = '用户名不能为空';
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = '用户密码不能为空';
      break;
    case 'USER_ALREADY_EXIST':
      statusCode = 409;
      message = '用户名已存在';
      break;
    case 'USER_NOT_EXIST':
      statusCode = 400;
      message = '用户不存在';
      break;
    case 'PASSWORD_NOT_MATCH':
      statusCode = 400;
      message = '用户密码不正确';
      break;
    case 'NOT_AUTHORIZATION':
      statusCode = 401;
      message = '请先登录';
      break;
    case 'USER_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = '没有权限';
      break;
    case 'FILE_NOT_FOUND':
      statusCode = 404;
      message = '找不到文件';
      break;
    case 'TAG_ALREADY_EXISTS':
      statusCode = 409;
      message = '标签已经存在';
      break;
    case 'POST_ALREADY_HAS_TAG':
      statusCode = 409;
      message = '内容标签已经存在';
      break;
    case 'UNABLE_TO_REPLY_THIS_COMMENT':
      statusCode = 409;
      message = '无法回复评论';
      break;
    case 'FILE_TYPE_NOT_ACCEPT':
      statusCode = 409;
      message = '文件类型不允许上传';
      break;
    case 'NOT_FOUND':
      statusCode = 404;
      message = '没有找到内容';
      break;
    case 'USER_NOT_FOUND':
      statusCode = 404;
      message = '没有找到用户';
      break;
    case 'PASSWORD_IS_THE_SAME':
      statusCode = 400;
      message = '修改密码不能和原密码相同';
      break;
    default:
      statusCode = 500;
      message = '服务请求失败';
      break;
  }
  response.status(statusCode).send({
    code: statusCode,
    message: message,
    data: [],
  });
};
