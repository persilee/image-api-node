import { Request, Response, NextFunction } from 'express';
import { createPost, deletePost, getPosts, updatePost } from './post.service';
import _ from 'lodash';

export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await getPosts();
    response.send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { title, content } = request.body;
  const { id: userId } = request.user;

  try {
    const data = await createPost({ title, content, userId });
    response.send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const post = _.pick(request.body, ['title', 'content']);
  try {
    const data = await updatePost(parseInt(postId, 10), post);
    response.send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  try {
    const data = await deletePost(parseInt(postId, 10));
    response.send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
