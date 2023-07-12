import express from 'express';

import AttendanceController from './controller';

import { jwtGuard } from '../../middlewares/jwtGuard';

const attendanceController = new AttendanceController();

const router = express.Router();

router.get('/checkin/:roomId', jwtGuard, attendanceController.checkin);
router.get('/checkout/:roomId', jwtGuard, attendanceController.checkout);

export default router;
