import express from 'express';

import VerifyController from './controller';
import passwordSchema from './validations/password';

import Validation from '../../middlewares/validation';

const router = express.Router();
const verifyController = new VerifyController();

router.post(
  '/:code',
  Validation(passwordSchema),
  verifyController.confirmPassword,
);
router.get('/:code', verifyController.verifyCode);
router.get('/', verifyController.mailer);

export default router;
