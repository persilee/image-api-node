import e, { Request, Response, NextFunction } from 'express';

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
