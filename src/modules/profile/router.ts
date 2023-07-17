import express from 'express';

import ProfileController from './controller';

import userSchema from './validations/user';
import passwordSchema from './validations/password';

import Validation from '../../middlewares/validation';
import { jwtGuard } from '../../middlewares/jwtGuard';
import { upload } from '../../middlewares/upload';

const router = express.Router();
const profileController = new ProfileController();

router.patch(
  '/edit',
  jwtGuard,
  Validation(userSchema),
  upload.single('avatar'),
  profileController.edit,
);
router.patch(
  '/password',
  jwtGuard,
  Validation(passwordSchema),
  profileController.editPassword,
);

router.delete('/', jwtGuard, profileController.delete);
router.get('/', jwtGuard, profileController.profile);

export default router;
