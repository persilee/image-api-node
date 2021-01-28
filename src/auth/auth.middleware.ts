import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userService from '../user/user.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { possess } from './auth.service';

/**
 * 验证用户登录
 * @param request
 * @param response
 * @param next
 */
export const validateLogin = async (
  request: Request,
  _response: Response,
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
 * 验证用户身份
 * @param request
 * @param response
 * @param next
 */
export const authGuard = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  return request.user.id ? next() : next(new Error('NOT_AUTHORIZATION'));
};

/**
 * 验证是否是当前用户
 */
export const currentUser = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  let user = {
    // 未登录的用户
    id: null,
    name: 'anonymous',
  };

  try {
    // 提取 Authorization
    const authorization = request.header('Authorization');

    // 提取 JWT 令牌
    const token = authorization.replace('Bearer ', '');

    if (token) {
      // 验证令牌
      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256'],
      });

      user = decoded as any;
    }
  } catch (error) {}

  // 在请求里添加当前用户
  request.user = user;

  next();
};

interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const { possession } = options;
    const { id: userId } = request.user;
    if (userId == 1) return next();
    const resourceIdParam = Object.keys(request.params)[0];
    console.log(resourceIdParam);

    const resourceType = resourceIdParam.replace('Id', '');
    const resourceId = parseInt(request.params[resourceIdParam], 10);
    if (possession) {
      try {
        const ownResource = await possess({ resourceId, resourceType, userId });
        if (!ownResource) return next(new Error('USER_NOT_OWN_RESOURCE'));
      } catch (error) {
        return next(error);
      }
    }
    next();
  };
};
