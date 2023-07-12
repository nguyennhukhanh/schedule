import * as Yup from 'yup';

const userSchema = Yup.object({
  firstname: Yup.string().max(
    20,
    'First name must be less than 20 characters.',
  ),
  lastname: Yup.string().max(20, 'Last name must be less than 20 characters.'),
  avatar: Yup.mixed(),
  email: Yup.string()
    .email('Please enter a valid email.')
    .max(50, 'Email must be less than 50 characters.'),
  password: Yup.string().min(6, 'Password must be at least 6 characters.'),
});

export default userSchema;
