import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import type { AppEnv } from '@/config/env.js';
import type { ContainerOverrides } from '@/container/create-container.js';
import { createContainer } from '@/container/create-container.js';
import { errorMiddleware } from '@/common/middlewares/error.middleware.js';
import { notFoundMiddleware } from '@/common/middlewares/not-found.middleware.js';
import { openApiSpec } from '@/infra/swagger/openapi.js';
import { createV1Router } from '@/routes/v1/index.js';

export const createApp = (env: AppEnv, overrides: ContainerOverrides = {}): Express => {
  const app = express();
  const container = createContainer(env, overrides);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.use('/api/v1', createV1Router(container));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
