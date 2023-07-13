import { NextFunction, Request, Response } from 'express';
import cache from 'memory-cache';

import { Room } from '../../models/room';
import { Time } from '../../models/time';
import { User } from '../../models/user';

import sendEmail from '../../services/sendEmail';

import { Message } from '../../common/constant/message';

import createResponse from '../../common/function/createResponse';
import incompetent from '../../common/function/incompetent';

export default class RoomController {
  async paginate(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const total = await Room.countDocuments();

      const userId = req.user.id;

      const page = Number(req.query.page) || 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const skip = (Number(page) - 1) * Number(limit);

      const rooms = await Room.find({ participants: userId })
        .sort({ 'dates.0': -1 }) // Sort by nearest date first
        .skip(skip)
        .limit(Number(limit))
        .populate(
          'participants',
          ['firstname', 'lastname', 'email', 'avatar'],
          'User',
        )
        .populate(
          'owner',
          ['firstname', 'lastname', 'email', 'avatar'],
          'User',
        );

      return createResponse(res, 200, true, Message.Sucess, {
        rooms,
        page,
        limit,
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneById(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const roomId = req.params.roomId;

      const isIncompetent = await incompetent(userId, roomId);
      if (!isIncompetent) {
        return createResponse(res, 400, false, Message.Incompetent);
      }

      const time = await Time.findOne({ room: roomId }).populate(
        'room',
        ['name', 'ipAddress', 'participants', 'owner'],
        'Room',
      );

      let result: any = {};
      if (time) {
        result = time.toObject();
        if (result.room) {
          result.room.dates = result.dates;
          delete result.dates;
          delete result._id;
        }
      }

      return createResponse(res, 200, true, Message.Sucess, result);
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const location = req.ip;

      const room = new Room({
        ...req.body,
        ipAddress: [location],
        owner: req.user.id,
      });
      await room.save();

      const timeLine = new Time({ dates: req.body.dates, room: room._id });
      await timeLine.save();

      return createResponse(res, 201, true, Message.CreateRoomSuccess, room);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const roomId = req.params.id;
      const room = req.body;
      const userId = req.user.id;

      const roomExists = await Room.findById(roomId);
      if (!roomExists) {
        return createResponse(res, 404, false, Message.RoomNotFound);
      }

      if (roomExists.owner.toString() !== userId) {
        return createResponse(
          res,
          403,
          false,
          Message.NotAuthorizedToUpdateRoom,
        );
      }

      const roomUpdated = await Room.findOneAndUpdate({ _id: roomId }, room, {
        new: true,
      });

      await Time.findOneAndUpdate(
        { room: roomId },
        { dates: req.body.dates },
        {
          new: true,
        },
      );

      if (roomUpdated) {
        return createResponse(
          res,
          200,
          true,
          Message.UpdateRoomSuccess,
          roomUpdated,
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const roomId = req.params.id;
      const userId = req.user.id;

      const room = await Room.findOne({ _id: roomId });

      if (!room) {
        return createResponse(res, 404, false, Message.RoomNotFound);
      }

      if (room.owner.toString() !== userId) {
        return createResponse(
          res,
          403,
          false,
          Message.NotAuthorizedToDeleteRoom,
        );
      }

      await Room.deleteOne({ _id: roomId });
      return createResponse(res, 200, true, Message.DeleteRoomSuccessfully);
    } catch (error) {
      next(error);
    }
  }

  async invite(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { receiver } = req.body;
      const { roomId } = req.params;

      const userId = req.user.id;

      const isIncompetent = await incompetent(userId, roomId);
      if (!isIncompetent) {
        return createResponse(res, 400, false, Message.Incompetent);
      }

      const roomExists = await Room.findById(roomId);
      if (!roomExists) {
        return createResponse(res, 404, false, Message.RoomNotFound);
      }

      const userExists = await User.findById(receiver);
      if (!userExists) {
        return createResponse(res, 404, false, Message.InvalidEmail);
      }

      const inviteExists = cache.get('invite');
      if (inviteExists) {
        return createResponse(res, 429, false, Message.Spam);
      }

      cache.put(
        'invite',
        `${receiver}${roomId}${roomExists.name}`,
        5 * 60 * 1000,
      );

      await sendEmail(
        userExists.email,
        Message.InviteToJoin,
        'email-template',
        {
          name: userExists.firstname,
          verificationLink: `${process.env.INVITE_LINK}/${roomId}`,
        },
      );

      return createResponse(res, 201, true, Message.SuccessfullyInvited);
    } catch (error) {
      next(error);
    }
  }

  async join(req: Request | any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;

      const roomExists = await Room.findOne({
        _id: roomId,
        participants: userId,
      });
      if (roomExists) {
        return createResponse(res, 400, false, Message.JoinError);
      } else {
        await Room.updateOne(
          { _id: roomId },
          {
            $push: { participants: userId },
          },
        );

        return createResponse(res, 201, true, Message.SuccessfulParticipation);
      }
    } catch (error) {
      next(error);
    }
  }
}
