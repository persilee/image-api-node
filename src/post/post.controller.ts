import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';

export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.send(await getPosts());
};
