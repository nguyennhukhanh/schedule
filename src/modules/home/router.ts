import express from 'express';

import HomeController from './controller';

import { jwtGuard } from '../../middlewares/jwtGuard';
import roleGuard from '../../middlewares/roleGuard';

const router = express.Router();
const homeController = new HomeController();

router.get('/', jwtGuard, roleGuard, homeController.home);

export default router;
