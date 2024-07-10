import createHttpError from 'http-errors';
import { findUser, register } from '../services/auth-servises.js';
import { comparePassword } from '../utils/hash.js';
import { createSession } from '../services/session-servises.js';
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

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const passwordComapare = comparePassword(password, user.password);
  if (!passwordComapare) {
    throw createHttpError(401, 'Password invalid');
  }
  const session = await createSession(user._id);
  res.status(201).json({
    status: 201,
    message: 'Successful',
    data: { accessToken: session.accessToken },
  });
};
