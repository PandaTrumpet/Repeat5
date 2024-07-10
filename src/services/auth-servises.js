import { UserCollection } from '../db/models/User.js';
import { hashPassword } from '../utils/hash.js';
export const findUser = (filter) => UserCollection.findOne(filter);

//
//
export const register = async (data) => {
  const { password } = data;
  const hashPass = await hashPassword(password);
  return UserCollection.create({ ...data, password: hashPass });
};
