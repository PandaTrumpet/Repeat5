import { Router } from 'express';
import { validateBody } from '../middleware/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  refreshUserController,
  registerUserController,
} from '../controllers/auth-controller.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/refresh', ctrlWrapper(refreshUserController));
export default authRouter;
