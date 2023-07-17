import * as Yup from 'yup';

const passwordSchema = Yup.object({
  currentPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Current password is required.'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('New password is required.'),
});

export default passwordSchema;
