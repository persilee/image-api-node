import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';

export const index = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.send(getPosts());
};
