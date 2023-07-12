import multer from 'multer';
import path from 'path';

import { Message } from '../common/constant/message';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../public/files/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(Message.ImageUploadFailedExt));
  }
  if (file.size > 7 * 1024 * 1024) {
    return cb(new Error(Message.ImageUploadFailedSize));
  }
  cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
