import { Request, Response, NextFunction } from 'express';
import {
  createPost,
  deletePost,
  deletePostTag,
  getPosts,
  updatePost,
} from './post.service';
import _ from 'lodash';
import { TagModel } from '../tag/tag.model';
import {
  createPostTag,
  createTag,
  findTagByName,
  postHasTag,
} from '../tag/tag.service';

export const index = async (
  _request: Request,
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

/**
 * 新增内容标签
 * @param request
 * @param response
 * @param next
 */
export const storePostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { name } = request.body;
  let tag: TagModel;

  try {
    tag = await findTagByName(name);
  } catch (error) {
    return next(error);
  }

  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);

      if (postTag) return next(new Error('POST_ALREADY_HAS_TAG'));
    } catch (error) {
      next(error);
    }
  }

  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      next(error);
    }
  }

  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    response.status(201).send({
      code: 201,
      data: {
        postId,
        tagId: tag.id,
        tag: name,
      },
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除文章标签
 * @param request
 * @param response
 * @param next
 */
export const destroyPostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { tagId } = request.body;

  try {
    const data = await deletePostTag(parseInt(postId, 10), tagId);
    response.status(200).send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
