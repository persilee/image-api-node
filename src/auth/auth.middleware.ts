import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userService from '../user/user.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';

/**
 * 验证用户登录
 * @param request
 * @param response
 * @param next
 */
export const validateLogin = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name, password } = request.body;
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name, { password: true });
  if (!user) return next(new Error('USER_NOT_EXIST'));

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_NOT_MATCH'));

  request.body.user = user;

  next();
};

/**
 * 验证token有效期
 * @param request
 * @param response
 * @param next
 */
export const authGuard = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authorization = request.header('Authorization');
    if (!authorization) throw new Error();
    const token = authorization.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    request.user = <TokenPayload>decoded;
    next();
  } catch (error) {
    next(new Error('NOT_AUTHORIZATION'));
  }
};
