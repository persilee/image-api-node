import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import bcrypt from 'bcrypt';

export const validateUser = async (
  request: Request,
  response: Response,
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
  response: Response,
  next: NextFunction,
) => {
  const { password } = request.body;
  request.body.password = await bcrypt.hash(password, 10);
  next();
};
