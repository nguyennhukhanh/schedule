import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cache from 'memory-cache';

import { User } from '../../models/user';

import sendEmail from '../../services/sendEmail';

import { SECRET_ROUNDS } from '../../common/constant/secret';
import { Message } from '../../common/constant/message';

import generateRandomString from '../../common/function/random';
import createResponse from '../../common/function/createResponse';

export default class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { firstname, lastname, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, SECRET_ROUNDS);

      const user = await new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      }).save();

      const code = generateRandomString(10);

      await sendEmail(user.email, Message.VerifyEmail, 'email-template', {
        name: user.firstname,
        verificationLink: `${process.env.VERIFICATION_LINK}/${code}`,
      });

      cache.put('email', user.email, 5 * 60 * 1000);

      return createResponse(res, 200, true, Message.CheckEmail);
    } catch (error) {
      return createResponse(res, 409, false, Message.DulicateEmail);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email, isVerify: true });

      if (!user) {
        return createResponse(res, 400, false, Message.InvalidEmail);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return createResponse(res, 400, false, Message.InvalidPassword);
      }

      const token = await signToken(res, user.id, user.email);
      return token;
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const refreshToken = req.body.refreshToken;
    try {
      const verifyToken: any = jwt.verify(refreshToken, process.env.JWT_SECRET);

      const token = await signToken(res, verifyToken.id, verifyToken.email);
      return token;
    } catch (error) {
      next(error);
    }
  }
}

// Create JWT
export async function signToken(
  res: Response,
  id: object,
  email: string,
): Promise<void> {
  const payload = { id, email };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  const refresh_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return createResponse(res, 200, true, Message.LoginSuccess, {
    accessToken: access_token,
    refreshToken: refresh_token,
  });
}
