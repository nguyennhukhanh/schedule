import express from 'express';

import AuthController from './controller';

import LoginSchema from './validations/login';
import registerSchema from './validations/register';

import Validation from '../../middlewares/validation';
import { jwtGuard } from '../../middlewares/jwtGuard';

const router = express.Router();
const authController = new AuthController();

router.post('/register', Validation(registerSchema), authController.register);
router.post('/login', Validation(LoginSchema), authController.login);
router.post('/refresh', jwtGuard, authController.refreshToken);

export default router;
