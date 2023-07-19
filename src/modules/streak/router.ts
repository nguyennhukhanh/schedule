import express from 'express';

import StreakController from './controller';

import { jwtGuard } from '../../middlewares/jwtGuard';

const router = express.Router();
const streakController = new StreakController();

router.get('/statistic', jwtGuard, streakController.statistic);
router.get('/', jwtGuard, streakController.paginate);

export default router;
