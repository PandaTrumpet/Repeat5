import { UserCollection } from '../db/models/User.js';
import { SessionSchema } from '../db/models/Session.js';
import createHttpError from 'http-errors';
createHttpError;
export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }
  const [bearer, accessToken] = authHeader.split(' ');
  if (!bearer) {
    return next(createHttpError(401, 'Bearer is missing'));
  }
  if (!accessToken) {
    return next(createHttpError(401, 'AccessToken is missing'));
  }
  const session = await SessionSchema.findOne({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Sission not found'));
  }
  const isAccessTokenExpired =
    Date.now() > Date.now(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'AccessToken expired'));
  }

  const user = UserCollection.findOne({ _id: session.userId });
  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }
  req.user = user;
  next();
  //   console.log(user);
};
