import * as Yup from 'yup';

const passwordSchema = Yup.object({
  password: Yup.string()
    .required('Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
});

export default passwordSchema;
