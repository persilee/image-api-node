import { Request, Response, NextFunction } from 'express';
import { selectCategory } from './category.service';

/**
 * 分类列表
 * @param request
 * @param response
 * @param next
 */
export const index = async (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await selectCategory();
    response.status(200).send({
      code: 200,
      data: data,
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
};
