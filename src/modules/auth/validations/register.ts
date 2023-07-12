import * as Yup from 'yup';

const registerSchema = Yup.object({
  firstname: Yup.string()
    .required('First name is required.')
    .max(20, 'First name must be less than 20 characters.'),
  lastname: Yup.string()
    .required('Last name is required.')
    .max(20, 'Last name must be less than 20 characters.'),
  email: Yup.string()
    .required('Email is required.')
    .email('Please enter a valid email.')
    .max(50, 'Email must be less than 50 characters.'),
  password: Yup.string()
    .required('Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
});

export default registerSchema;
