import express from 'express';

import VerifyController from './controller';

const router = express.Router();
const verifyController = new VerifyController();

router.get('/:code', verifyController.verifyCode);
router.get('/', verifyController.mailer);

export default router;
