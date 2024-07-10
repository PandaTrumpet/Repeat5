import pino from 'pino-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import contactRouter from './routers/contacts.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.get('/', (req, res, next) => {
    res.json({
      message: 'Hello world',
    });
  });
  app.use('/auth', authRouter);
  app.use(contactRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
