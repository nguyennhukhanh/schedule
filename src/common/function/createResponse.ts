import { Response } from 'express';

export default function createResponse(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: object,
) {
  res.status(statusCode).json({ statusCode, success, message, data });
}
