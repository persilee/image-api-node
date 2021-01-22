import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import bcrypt from 'bcrypt';
import _ from 'lodash';

export const validateUser = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { name, password } = request.body;
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name);
  if (user) return next(new Error('USER_ALREADY_EXIST'));

  next();
};

export const hashPassword = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { password } = request.body;
  request.body.password = await bcrypt.hash(password, 10);
  next();
};

/**
 * 验证用户
 * @param request
 * @param response
 * @param next
 */
export const validateUpdateUser = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { validate, update } = request.body;
  const { id: userId } = request.user;
  try {
    if (!_.has(validate, 'password')) {
      return next(new Error('PASSWORD_IS_REQUIRED'));
    }

    const data = await userService.getUserById(userId, { password: true });
    const matched = await bcrypt.compare(validate.password, data.password);

    if (!matched) return next(new Error('PASSWORD_NOT_MATCH'));

    if (update.name) {
      const data = await userService.getUserByName(update.name);
      console.log(data);

      if (data) return next(new Error('USER_ALREADY_EXIST'));
    }

    if (update.password) {
      const matched = await bcrypt.compare(update.password, data.password);
      if (matched) return next(new Error('PASSWORD_IS_THE_SAME'));
      request.body.update.password = await bcrypt.hash(update.password, 10);
    }
  } catch (error) {
    return next(error);
  }

  next();
};
