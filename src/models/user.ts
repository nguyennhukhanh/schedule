import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: { type: String, required: true, maxLength: 50 },
    lastname: { type: String, required: true, maxLength: 50 },
    email: { type: String, required: true, maxLength: 50, unique: true },
    avatar: { type: String },
    password: { type: String, required: true },
    isVerify: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: true,
    },
  },
);

export const User = mongoose.model('User', userSchema);
