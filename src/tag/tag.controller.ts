import { Request, Response, NextFunction } from 'express';
import { createTag, findTagByName } from './tag.service';

/**
 * 新建标签
 * @param request
 * @param response
 * @param next
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name } = request.body;
  try {
    const tag = await findTagByName(name);
    if (tag) throw new Error('TAG_ALREADY_EXISTS');
    const data = await createTag({ name });
    response.status(201).send({
      code: 201,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
