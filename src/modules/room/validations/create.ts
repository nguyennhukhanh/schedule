import * as yup from 'yup';

const createRoomSchema = yup.object().shape({
  name: yup.string().required().max(50),
  ipAddress: yup.array().of(yup.string()),
  dates: yup.array().of(yup.array().of(yup.date())),
  participants: yup.array().of(yup.string()).required(),
});

export default createRoomSchema;
