import { Request, Response, NextFunction } from 'express';

/**
 * 拦截rul
 * @param request
 * @param response
 * @param next
 */
export const requestUrl = (
  request: Request,
  response: Response,
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
  request: Request,
  response: Response,
  next: NextFunction,
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
