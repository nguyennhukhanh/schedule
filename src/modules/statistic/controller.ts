import { NextFunction, Request, Response } from 'express';

import { Attendance } from '../../models/attendance';

import { Message } from '../../common/constant/message';

import createResponse from '../../common/function/createResponse';
import incompetent from '../../common/function/incompetent';

export default class StatisticController {
  async paginate(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const total = await Attendance.countDocuments();

      const roomId = req.params.roomId;
      const userId = req.user.id;

      const isIncompetent = await incompetent(userId, roomId);
      if (!isIncompetent) {
        return createResponse(res, 400, false, Message.Incompetent);
      }

      const page = Number(req.query.page) || 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const skip = (Number(page) - 1) * Number(limit);

      const attendances = await Attendance.find({ room: roomId })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', ['firstname', 'lastname', 'email', 'avatar'], 'User')
        .populate(
          'room',
          ['name', 'ipAddress', 'participants', 'owner'],
          'Room',
        );

      return createResponse(res, 200, true, Message.Sucess, {
        attendances,
        page,
        limit,
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { attendanceId } = req.params;

      const attendances = await Attendance.findById(attendanceId)
        .populate('user', ['firstname', 'lastname', 'email', 'avatar'], 'User')
        .populate(
          'room',
          ['name', 'ipAddress', 'participants', 'owner'],
          'Room',
        );
      if (!attendances) {
        return createResponse(res, 404, false, Message.AttendanceNotFound);
      }
      return createResponse(res, 200, true, Message.Sucess, attendances);
    } catch (error) {
      next(error);
    }
  }

  async findByDay(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { date, roomId } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    try {
      const attendances = await Attendance.find({
        checkIn: { $gte: startDate, $lt: endDate },
        room: roomId,
      })
        .populate('user', ['firstname', 'lastname', 'email', 'avatar'], 'User')
        .populate(
          'room',
          ['name', 'ipAddress', 'participants', 'owner'],
          'Room',
        );

      if (!attendances) {
        return createResponse(res, 404, false, Message.AttendanceNotFound);
      }

      const count = attendances.length;

      return createResponse(
        res,
        count === 0 ? 404 : 200,
        count === 0 ? false : true,
        count === 0 ? Message.Failed : Message.Sucess,
        {
          attendances,
          count,
        },
      );
    } catch (error) {
      next(error);
    }
  }

  async findByUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, roomId } = req.query;

      const attendances = await Attendance.find({
        user: userId,
        room: roomId,
      })
        .populate('user', ['firstname', 'lastname', 'email', 'avatar'], 'User')
        .populate(
          'room',
          ['name', 'ipAddress', 'participants', 'owner'],
          'Room',
        );

      if (!attendances) {
        return createResponse(res, 404, false, Message.UserNotFound);
      }

      const count = attendances.length;

      return createResponse(
        res,
        count === 0 ? 404 : 200,
        count === 0 ? false : true,
        count === 0 ? Message.Failed : Message.Sucess,
        {
          attendances,
          count,
        },
      );
    } catch (error) {
      next(error);
    }
  }
}
