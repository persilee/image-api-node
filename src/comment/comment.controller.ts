import { Request, Response, NextFunction } from 'express';
import { CommentModel } from './comment.model';
import {
  createComment,
  deleteComment,
  getCommentReplies,
  getComments,
  getCommentTotal,
  isReplyComment,
  updateComment,
} from './comment.service';

/**
 * 新增评论
 * @param request
 * @param response
 * @param next
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const comment = { content, postId, userId };

  try {
    const data = await createComment(comment);
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
 * 回复评论
 * @param request
 * @param response
 * @param next
 */
export const reply = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);
  const { id: userId } = request.user;
  const { content, postId } = request.body;

  const comment: CommentModel = {
    content,
    postId,
    userId,
    parentId,
  };

  try {
    const reply = await isReplyComment(parentId);
    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    next(error);
  }

  try {
    const data = await createComment(comment);
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
 * 修改评论
 * @param request
 * @param response
 * @param next
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const { content } = request.body;

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  try {
    const data = await updateComment(comment);
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
 * 删除评论
 * @param request
 * @param response
 * @param next
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;

  try {
    const data = await deleteComment(parseInt(commentId, 10));
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
 * 获取评论列表
 * @param request
 * @param response
 * @param next
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const totalCount = await getCommentTotal({ filter: request.filter });
    const data = await getComments({
      filter: request.filter,
      pagination: request.pagination,
    });
    response.status(200).send({
      code: 200,
      data: {
        total: totalCount,
        data: data,
      },
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 查询回复评论列表
 * @param request
 * @param response
 * @param next
 */
export const indexReplies = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;

  try {
    const data = await getCommentReplies(parseInt(commentId, 10));
    response.status(200).send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
