import express from 'express';

import StatisticController from './controller';

import { jwtGuard } from '../../middlewares/jwtGuard';

const router = express.Router();
const statisticController = new StatisticController();

router.get('/paginate/:roomId', jwtGuard, statisticController.paginate);

router.get('/find-by-day', jwtGuard, statisticController.findByDay);
router.get('/find-by-user', jwtGuard, statisticController.findByUser);

router.get('/:attendanceId', jwtGuard, statisticController.getOneById);

export default router;
