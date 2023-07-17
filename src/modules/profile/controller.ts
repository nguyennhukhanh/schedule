import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { User } from '../../models/user';

import deleteFile from '../../services/deleteFile';

import { SECRET_ROUNDS } from '../../common/constant/secret';
import { Message } from '../../common/constant/message';

import createResponse from '../../common/function/createResponse';

export default class ProfileController {
  async profile(req: Request, res: Response): Promise<void> {
    return createResponse(res, 200, true, Message.MyProfile, req.user);
  }

  async edit(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { firstname, lastname, email } = req.body;

      const avatarPath = req.file ? req.file.filename : undefined;

      const user = await User.findById(req.user.id);

      if (user.avatar) {
        if (avatarPath) {
          deleteFile(user.avatar);
        }
      }

      await user.updateOne({
        firstname,
        lastname,
        email,
        avatar: avatarPath,
      });

      return createResponse(res, 200, true, Message.ProfileUpdated);
    } catch (error) {
      next(error);
    }
  }

  async editPassword(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return createResponse(res, 400, false, Message.ErrorPassword);

      let hashedPassword = undefined;

      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, SECRET_ROUNDS);
      }

      await user.updateOne({
        password: hashedPassword,
      });

      return createResponse(res, 200, true, Message.ProfileUpdated);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        deleteFile(user.avatar);
        await User.deleteOne({ _id: req.user.id });
      }
      return createResponse(res, 200, true, Message.DeletedAccount);
    } catch (error) {
      next(error);
    }
  }
}
