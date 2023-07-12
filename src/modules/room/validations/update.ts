import * as yup from 'yup';

const updateRoomSchema = yup.object().shape({
  name: yup.string().max(50),
  ipAddress: yup.array().of(yup.string()),
  dates: yup.array().of(yup.array().of(yup.date())),
  participants: yup.array().of(yup.string()),
});

export default updateRoomSchema;
