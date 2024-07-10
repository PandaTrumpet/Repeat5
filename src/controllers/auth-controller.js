import createHttpError from 'http-errors';
import { findUser, register } from '../services/auth-servises.js';

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const newUser = await register(req.body);
  const data = { name: newUser.name, email: newUser.email };
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};
