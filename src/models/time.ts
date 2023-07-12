import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const timeSchema = new Schema({
  dates: [
    {
      type: [Date],
      required: true,
    },
  ],
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
});

export const Time = mongoose.model('Time', timeSchema);
