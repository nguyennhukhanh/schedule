import { NextFunction, Request, Response } from 'express';

import { Attendance } from '../../models/attendance';

import createResponse from '../../common/function/createResponse';
import { Message } from '../../common/constant/message';

export default class StreakController {
  async paginate(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const total = await Attendance.countDocuments();

      const { roomId, userId, date, options } = req.query;

      const page = Number(req.query.page) || 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = (Number(page) - 1) * Number(limit);

      const query: any = {};
      if (roomId) {
        query.room = roomId;
      }
      if (userId) {
        query.user = userId;
      }
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        switch (options) {
          case 'year':
            startDate.setMonth(0, 1); // Đặt ngày bắt đầu là ngày đầu tiên của năm
            endDate.setFullYear(startDate.getFullYear() + 1);
            endDate.setMonth(0, 1); // Đặt ngày kết thúc là ngày đầu tiên của năm tiếp theo
            break;
          case 'month':
            startDate.setDate(1); // Đặt ngày bắt đầu là ngày đầu tiên của tháng
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(1); // Đặt ngày kết thúc là ngày đầu tiên của tháng tiếp theo
            break;
          default:
            endDate.setDate(startDate.getDate() + 1);
        }
        query.checkIn = { $gte: startDate, $lt: endDate };
      }

      const attendances = await Attendance.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate('user', ['firstname', 'email', 'avatar'], 'User');

      const totalTimes = attendances.reduce((acc, cur: any) => {
        // Kiểm tra xem người dùng hiện tại đã có trong mảng kết quả chưa
        const userIndex = acc.findIndex(
          (item) => item.user.toString() === cur.user._id.toString(),
        );

        if (userIndex === -1) {
          // Nếu chưa có, thêm người dùng mới vào mảng kết quả
          acc.push({
            user: cur.user._id,
            firstname: cur.user.firstname,
            email: cur.user.email,
            avatar: cur.user.avatar,
            totalTimePeriodStarts: cur.timePeriodStarts,
            totalTimePeriodEnds: cur.timePeriodEnds,
          });
        } else {
          // Nếu đã có, cập nhật tổng thời gian cho người dùng đó
          acc[userIndex].totalTimePeriodStarts += cur.timePeriodStarts;
          acc[userIndex].totalTimePeriodEnds += cur.timePeriodEnds;
        }

        return acc;
      }, []);

      const messages = totalTimes.map((item) => {
        const userMessages: any = { user: item.user };
        if (item.totalTimePeriodStarts) {
          item.totalTimePeriodStarts > 0
            ? (userMessages.timePeriodStarts = `Đi sớm ${item.totalTimePeriodStarts} phút!`)
            : (userMessages.timePeriodStarts = `Đi trễ ${-item.totalTimePeriodStarts} phút!`);
        }

        if (item.totalTimePeriodEnds) {
          item.totalTimePeriodEnds > 0
            ? (userMessages.timePeriodEnds = `Ra về trễ ${item.totalTimePeriodEnds} phút!`)
            : (userMessages.timePeriodEnds = `Ra về sớm ${-item.totalTimePeriodEnds} phút!`);
        }

        return userMessages;
      });

      const data = {
        totalTimes,
        messages,
      };

      return createResponse(res, 200, true, Message.Sucess, {
        ...data,
        page,
        limit,
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  async statistic(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roomId } = req.query;

      const attendances = await Attendance.find({ room: roomId }).populate(
        'user',
        ['firstname', 'email', 'avatar'],
        'User',
      );

      const totalTimes = attendances.reduce((acc, cur: any) => {
        // Kiểm tra xem người dùng hiện tại đã có trong mảng kết quả chưa
        const userIndex = acc.findIndex(
          (item) => item.user.toString() === cur.user._id.toString(),
        );

        if (userIndex === -1) {
          // Nếu chưa có, thêm người dùng mới vào mảng kết quả
          acc.push({
            user: cur.user._id,
            firstname: cur.user.firstname,
            email: cur.user.email,
            avatar: cur.user.avatar,
            totalTime: cur.timePeriodStarts + cur.timePeriodEnds,
          });
        } else {
          // Nếu đã có, cập nhật tổng thời gian cho người dùng đó
          acc[userIndex].totalTime += cur.timePeriodStarts + cur.timePeriodEnds;
        }

        return acc;
      }, []);

      const maxTotalTime = Math.max(
        ...totalTimes.map((item) => item.totalTime),
      );
      const minTotalTime = Math.min(
        ...totalTimes.map((item) => item.totalTime),
      );
      const maxTotalTimeUser = totalTimes.find(
        (item) => item.totalTime === maxTotalTime,
      );
      const minTotalTimeUser = totalTimes.find(
        (item) => item.totalTime === minTotalTime,
      );

      return createResponse(res, 200, true, Message.Sucess, {
        maxTotalTimeUser,
        minTotalTimeUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
