import jwt from 'jsonwebtoken';
import cache from 'memory-cache';

export default function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  const secretCode = jwt.sign({ randomString }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  // Save cache
  cache.put('secret-code', secretCode, 5 * 60 * 1000);

  return randomString;
}
