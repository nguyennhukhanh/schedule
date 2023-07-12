/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

export default function error(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let statusCode = 500;
  const success = false;
  let message = error.message;

  switch (error.name) {
    case 'CastError':
      statusCode = 400;
      message = 'ID không hợp lệ';
      break;
    case 'ValidationError':
      statusCode = 400;
      message = error.message;
      break;
    default:
      if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
      }
      break;
  }

  res.status(statusCode).json({ statusCode, success, message });
}
