import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  ipAddress: { type: [String], required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Room = mongoose.model('Room', roomSchema);
