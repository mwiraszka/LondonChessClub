import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express, { Router } from 'express';

import { helloWorld } from './middlewares/hello-world.middleware';
import { logger } from './middlewares/logger.middleware';
import { version } from './middlewares/version.middleware';
import { articlesRouter } from './routers/articles.router';
import { eventsRouter } from './routers/events.router';
import { imagesRouter } from './routers/images.router';
import { adminMembersRouter, publicMembersRouter } from './routers/members.router';
import { usersRouter } from './routers/users.router';
import { connectToDatabase } from './services/mongo-db.service';

const { PORT } = process.env;
if (!PORT) {
  throw new Error('Unable to parse server port from environment variables.');
}

const app = express();

const router = Router()
  .use('/v1/test', helloWorld)
  .use('/v1/version', version)
  .use('/v1/articles', articlesRouter)
  .use('/v1/events', eventsRouter)
  .use('/v1/images', imagesRouter)
  .use('/v1/public/members', publicMembersRouter)
  .use('/v1/admin/members', adminMembersRouter)
  .use('/v1/users', usersRouter);

const corsOptions: CorsOptions = {
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  /**
   * Provides a status code to use for successful OPTIONS requests,
   * since some legacy browsers (IE11, various SmartTVs) choke on 204.
   */
  optionsSuccessStatus: 200,
  origin: [
    'http://localhost:4200',
    'https://londonchess.ca',
    'http://lcc-website-preview.s3-website.us-east-2.amazonaws.com',
  ],
};

const startServer = async () => {
  try {
    await connectToDatabase();

    app
      .use(cors(corsOptions))
      .use(cookieParser())
      .use(logger)
      .use(express.json({ limit: '50MB' }))
      .use(express.urlencoded({ extended: true, limit: '50MB' }))
      .use(router);

    Sentry.setupExpressErrorHandler(app);

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
