import { Request, Response, NextFunction } from 'express';

import { Role } from '../common/constant/role';
import { Message } from '../common/constant/message';

export default async function roleGuard(
  req: Request | any,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.user.role === Role.Admin) {
    next();
  } else {
    res.status(403).json({ message: Message.NotAuthorizedAccount });
  }
}
