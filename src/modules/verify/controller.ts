import { NextFunction, Request, Response } from 'express';
import cache from 'memory-cache';
import jwt from 'jsonwebtoken';

import { signToken } from '../auth/controller';
import { User } from '../../models/user';
import sendEmail from '../../services/sendEmail';
import generateRandomString from '../../common/function/random';
import { Message } from '../../common/constant/message';
import createResponse from '../../common/function/createResponse';

export default class VerifyController {
  async mailer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.query;
      const emailExists = cache.get('email');
      if (emailExists) {
        return createResponse(res, 429, false, Message.Spam);
      }

      const userExists = await User.findOne({ email });
      if (!userExists) {
        return createResponse(res, 404, false, Message.EmailNotFound);
      }

      const code = await generateRandomString(10);

      await sendEmail(
        userExists.email,
        Message.ForgotPassword,
        'email-template',
        {
          name: userExists.firstname,
          verificationLink: `${process.env.VERIFICATION_LINK}/${code}`,
        },
      );

      cache.put('email', userExists.email, 5 * 60 * 1000);

      return createResponse(res, 200, true, Message.CheckEmail);
    } catch (error) {
      next(error);
    }
  }

  async verifyCode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<object | void> {
    try {
      const { code } = req.params;

      const secretCodeExists = cache.get('secret-code');
      const emailExists = cache.get('email');

      if (!secretCodeExists) {
        return createResponse(res, 404, false, Message.CodeHasExpired);
      } else {
        const verifyCode: any = jwt.verify(
          secretCodeExists,
          process.env.JWT_SECRET,
        );
        if (verifyCode.randomString === code) {
          cache.del('secret-code');
          cache.del('email');

          const userExists = await User.findOneAndUpdate(
            { email: emailExists },
            { isVerify: true },
          );

          const token = await signToken(res, userExists.id, userExists.email);
          return token;
        } else {
          return createResponse(res, 404, false, Message.CodeNotVerified);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}
