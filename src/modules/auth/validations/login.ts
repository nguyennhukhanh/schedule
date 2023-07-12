import * as Yup from 'yup';

const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required.')
    .email('Please enter a valid email.')
    .max(50, 'Email must be less than 50 characters.'),
  password: Yup.string()
    .required('Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
});

export default loginSchema;
