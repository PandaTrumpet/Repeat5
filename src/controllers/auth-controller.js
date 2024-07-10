import createHttpError from 'http-errors';
import { findUser, register } from '../services/auth-servises.js';
import { comparePassword } from '../utils/hash.js';
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/session-servises.js';
import { ONE_DAY } from '../constans/index.js';
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};
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

  setupSession(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successful',
    data: { accessToken: session.accessToken },
  });
};

export const refreshUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const currentSession = await findSession({ _id: sessionId, refreshToken });
  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }
  const refreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);
  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }
  const newSession = await createSession(currentSession.userId);
  setupSession(res, newSession);
  res.status(200).json({
    status: 200,
    message: 'Successfusl',
    data: { accessToken: newSession.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }
  await deleteSession({ _id: sessionId });
  // console.log(deleteSession);
  res.clearCookie('sessionId'), res.clearCookie('refreshToken');
  res.status(204).send();
};
