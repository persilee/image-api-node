import { Request, Response, NextFunction } from 'express';
import { signToken } from './auth.service';

/**
 * 用户登录且签发token
 * @param request
 * @param response
 * @param next
 */
export const login = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    user: { id, name },
  } = request.body;
  const payload = { id, name };
  try {
    const token = signToken({ payload });
    response.send({
      code: 200,
      data: {
        id,
        name,
        token,
      },
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证用户登录
 * @param request
 * @param response
 * @param next
 */
export const validate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.status(200).send({
    code: 200,
    data: request.user,
    message: 'success',
  });
};
