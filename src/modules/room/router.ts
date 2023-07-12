import express from 'express';

import RoomController from './controller';
import createRoomSchema from './validations/create';
import updateRoomSchema from './validations/update';

import { jwtGuard } from '../../middlewares/jwtGuard';
import Validation from '../../middlewares/validation';

const router = express.Router();
const roomController = new RoomController();

router.post(
  '/create',
  jwtGuard,
  Validation(createRoomSchema),
  roomController.create,
);

router.patch(
  '/update/:id',
  jwtGuard,
  Validation(updateRoomSchema),
  roomController.update,
);

router.delete('/delete/:id', jwtGuard, roomController.delete);

router.post('/invite/:roomId', jwtGuard, roomController.invite);
router.get('/join/:roomId', jwtGuard, roomController.join);

router.get('/paginate', jwtGuard, roomController.paginate);
router.get('/:roomId', jwtGuard, roomController.getOneById);

export default router;
