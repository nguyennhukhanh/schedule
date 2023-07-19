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
      let timePeriodStarts: number;

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

      const timeParts = time.split(':').map(Number);
      const formattedDateParts = formattedDate.split(':').map(Number);
      const timeInMinutes =
        timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
      const formattedDateInMinutes =
        formattedDateParts[0] * 60 +
        formattedDateParts[1] +
        formattedDateParts[2] / 60;
      if (time <= formattedDate) {
        timePeriodStarts = timeInMinutes - formattedDateInMinutes; // Đi sớm (> 0)
      } else {
        timePeriodStarts = timeInMinutes - formattedDateInMinutes; // Đi trễ (< 0)
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
        timePeriodStarts,
        room: roomId,
        user: userId,
      }).save();

      return createResponse(res, 201, true, Message.CheckInSuccessfully, {
        checkIn: startOrFinishTime,
        timePeriodStarts: attendance.timePeriodStarts,
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

      let timePeriodEnds: number;

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

      const timeParts = time.split(':').map(Number);
      const formattedDateParts = formattedDate.split(':').map(Number);
      const timeInMinutes =
        timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
      const formattedDateInMinutes =
        formattedDateParts[0] * 60 +
        formattedDateParts[1] +
        formattedDateParts[2] / 60;
      if (time >= formattedDate) {
        timePeriodEnds = timeInMinutes - formattedDateInMinutes; // Về trễ (> 0)
      } else {
        timePeriodEnds = timeInMinutes - formattedDateInMinutes; // Về sớm (< 0)
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
          timePeriodEnds,
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
          timePeriodEnds: attendanceExecuted.timePeriodEnds,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
