import { NextFunction, Request, Response } from 'express';
import moment from 'moment-timezone';

import { Attendance } from '../../models/attendance';
import { Room } from '../../models/room';
import { Time } from '../../models/time';
import { Message } from '../../common/constant/message';
import getLocationFromIpAddress from '../../services/location';
import createResponse from '../../common/function/createResponse';

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
      const checkIp = await checkIpAddress(room);
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

      const { startOrFinishTime, checkInByDay, time } = await getDates();

      const formattedDate = moment(startTime)
        .subtract(parseInt(process.env.SG), 'hours') // Trừ đi vì nó vẫn lấy giờ trên múi giờ vn suy ra từ múi giờ UTC
        .format('HH:mm:ss');
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
      const checkIp = await checkIpAddress(room);
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

      const { startOrFinishTime, checkInByDay, time } = await getDates();

      const formattedDate = moment(endTime)
        .subtract(parseInt(process.env.SG), 'hours') // Trừ đi vì nó vẫn lấy giờ trên múi giờ vn suy ra từ múi giờ UTC
        .format('HH:mm:ss');
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

async function getCurrentDate(roomId: object): Promise<void | object> {
  const timeLine = await Time.findOne({ room: roomId });
  const currentArrDate = timeLine.dates;
  const result = currentArrDate.find((dateRange) => {
    const startDate = dateRange[0];
    return new Date(startDate).toDateString() === new Date().toDateString();
  });

  return result;
}

async function getDates(): Promise<{
  startOrFinishTime: Date;
  checkInByDay: string;
  time: string;
}> {
  const date = new Date();
  const result = moment.utc(date);
  return {
    startOrFinishTime: result.toDate(),
    checkInByDay: result.format('YYYY-MM-DD'),
    time: result.format('HH:mm:ss'),
  };
}

async function checkIpAddress(room: any): Promise<boolean> {
  const location = await getLocationFromIpAddress();
  const ipAddress = room.ipAddress.some(
    (element: string) => element == location.ip,
  );
  return ipAddress;
}
