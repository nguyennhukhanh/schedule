import mongoose from 'mongoose';

import { Announce } from './constant/announce';

export default async function connect(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.info(Announce.SuccessfulConnection);
  } catch (error) {
    console.error(Announce.ConnectionFailed);
  }
}
