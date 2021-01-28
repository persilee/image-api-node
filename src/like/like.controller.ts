import { Request, Response, NextFunction } from 'express';
import {
  createUserLikePost,
  deleteLikePost,
  isLikedPost,
} from './like.service';

/**
 * 点赞文章(点击创建，再点取消)
 * @param request
 * @param response
 * @param next
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { id: userId } = request.user;

  try {
    const isLiked = await isLikedPost(userId, parseInt(postId, 10));

    console.log(isLiked);

    if (isLiked) {
      const data = await deleteLikePost(userId, parseInt(postId, 10));
      response.status(200).send({
        code: 200,
        data: data,
        message: 'success',
      });
    } else {
      const data = await createUserLikePost(userId, parseInt(postId, 10));
      response.status(201).send({
        code: 201,
        data: data,
        message: 'success',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 取消点赞
 * @param request
 * @param response
 * @param next
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { id: userId } = request.user;

  try {
    const data = await deleteLikePost(userId, parseInt(postId, 10));
    response.status(200).send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
