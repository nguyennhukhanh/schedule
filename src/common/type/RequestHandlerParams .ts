import { NextFunction, Request, Response } from 'express';

export type RequestHandlerParams = [
  req: Request | any,
  res: Response,
  next: NextFunction,
];
