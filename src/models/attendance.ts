import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  checkIn: { type: Date },
  checkOut: { type: Date },
  timePeriodStarts: { type: Number, default: 0 }, // Nó chứa giá trị dương thì khoảng đó người dùng đi sớm, âm thì người dùng đi trễ nên gọi là khoảng của thời gian bắt đầu. Đơn vị phút
  timePeriodEnds: { type: Number, default: 0 }, // Nó chứa giá trị dương thì khoảng đó người dùng về trễ, âm thì người dùng về sớm nên gọi là khoảng của thời gian kết thúc. Đơn vị phút
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);
