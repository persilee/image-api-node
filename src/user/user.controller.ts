import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userService from './user.service';
import _ from 'lodash';

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

/**
 * 获取用户
 * @param request
 * @param response
 * @param next
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { userId } = request.params;

  try {
    const data = await userService.getUserById(parseInt(userId, 10));
    if (!data) return next(new Error('USER_NOT_FOUND'));
    response.status(200).send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户
 * @param request
 * @param response
 * @param next
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id } = request.user;
  const userData = _.pick(request.body.update, ['name', 'password']);
  try {
    const data = await userService.updateUser(id, userData);
    response.status(201).send({
      code: 201,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
