import { NextFunction, Request, Response } from 'express';
import moment from 'moment-timezone';

import { Attendance } from '../../models/attendance';
import { Room } from '../../models/room';

import { Message } from '../../common/constant/message';

import createResponse from '../../common/function/createResponse';
import checkIpAddress from '../../common/function/checkIpAddress';
import getDates from '../../common/function/getDates';
import getCurrentDate from '../../common/function/getCurrentDate';

export default class AttendanceController {
  async checkin(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const roomId = req.params.roomId;
      const userId = req.user.id;
      let isLateArrival: boolean;

      const room = await Room.findById(roomId);
      const checkIp = checkIpAddress(req.ip, room);
      if (!checkIp) {
        return createResponse(res, 400, false, Message.checkIpAddress);
      }

      const isParticipant = room.participants.some(
        (participant) => participant == userId,
      );
      if (!isParticipant) {
        return createResponse(res, 400, false, Message.NotParticipate);
      }

      const currentDate = await getCurrentDate(roomId);
      if (!currentDate) {
        return createResponse(res, 400, false, Message.DaysOff);
      }
      const startTime = currentDate[0];

      const { startOrFinishTime, checkInByDay, time } = getDates();

      const formattedDate = moment(startTime).format('HH:mm:ss');
      if (time <= formattedDate) {
        isLateArrival = false;
      } else {
        isLateArrival = true;
      }

      const startDate = new Date(checkInByDay);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      const attendanceExists = await Attendance.findOne({
        room: roomId,
        user: userId,
        checkIn: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      if (attendanceExists) {
        return createResponse(res, 400, false, Message.CheckedIn);
      }

      const attendance = await new Attendance({
        checkIn: startOrFinishTime,
        isLateArrival,
        room: roomId,
        user: userId,
      }).save();

      return createResponse(res, 201, true, Message.CheckInSuccessfully, {
        checkIn: startOrFinishTime,
        isLateArrival: attendance.isLateArrival,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkout(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const roomId = req.params.roomId;
      const userId = req.user.id;

      let isLeaveEarly: boolean;

      const room = await Room.findById(roomId);
      const checkIp = checkIpAddress(req.ip, room);
      if (!checkIp) {
        return createResponse(res, 400, false, Message.checkIpAddress);
      }

      const isParticipant = room.participants.some(
        (participant) => participant == userId,
      );
      if (!isParticipant) {
        return createResponse(res, 400, false, Message.NotParticipate);
      }

      const currentDate = await getCurrentDate(roomId);
      if (!currentDate) {
        return createResponse(res, 400, false, Message.DaysOff);
      }
      const endTime = currentDate[1];

      const { startOrFinishTime, checkInByDay, time } = getDates();

      const formattedDate = moment(endTime).format('HH:mm:ss');
      if (time >= formattedDate) {
        isLeaveEarly = false;
      } else {
        isLeaveEarly = true;
      }

      const startDate = new Date(checkInByDay);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      const attendanceExecuted = await Attendance.findOneAndUpdate(
        {
          room: roomId,
          user: userId,
          checkIn: {
            $gte: startDate,
            $lt: endDate,
          },
        },
        {
          checkOut: startOrFinishTime,
          isLeaveEarly,
        },
        {
          new: true,
        },
      );

      if (!attendanceExecuted) {
        return createResponse(res, 400, false, Message.CheckOutFailed);
      } else {
        return createResponse(res, 201, true, Message.CheckOutSuccessfully, {
          checkOut: startOrFinishTime,
          isLeaveEarly: attendanceExecuted.isLeaveEarly,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
