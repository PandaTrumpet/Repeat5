import { FIFTEEN_MINUTES, ONE_DAY } from '../constans/index.js';
import { SessionSchema } from '../db/models/Session.js';
import { randomBytes } from 'node:crypto';
export const createSession = async (userId) => {
  await SessionSchema.deleteOne({ userId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);
  return SessionSchema.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const findSession = (filter) => SessionSchema.findOne(filter);

export const deleteSession = (filter) => SessionSchema.deleteOne(filter );
