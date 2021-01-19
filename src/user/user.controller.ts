import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userService from './user.service';

/**
 * 注册用户
 * @param request
 * @param response
 * @param next
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name, password } = request.body;
  try {
    const data = await userService.createUser({ name, password });
    response.status(201).send({
      code: 201,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
