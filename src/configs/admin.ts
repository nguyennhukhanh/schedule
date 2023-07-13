import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import Manager from './class/Manager';

import { User } from '../models/user';

import connect from '../common/database';

import { SECRET_ROUNDS } from '../common/constant/secret';
import { Announce } from '../common/constant/announce';

dotenv.config();

connect();

async function initAdmin(): Promise<void> {
  const existingUser = await User.findOne({ email: process.env.ADMIN_MAIL });
  if (!existingUser) {
    const admin = new Manager(
      process.env.ADMIN_FIRSTNAME,
      process.env.ADMIN_LASTNAME,
      process.env.ADMIN_MAIL,
      await bcrypt.hash(process.env.ADMIN_PASSWORD, SECRET_ROUNDS),
      true,
    );

    const newUser = new User(admin);
    await newUser.save();

    console.info(Announce.CreateAdminSuccessfully);
  } else {
    console.warn(Announce.CreateAdminFailed);
  }
}

initAdmin();
