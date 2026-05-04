import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/common/errors/api-error.js';
import { errorMiddleware } from '@/common/middlewares/error.middleware.js';
import { notFoundMiddleware } from '@/common/middlewares/not-found.middleware.js';
import { validateRequest } from '@/common/middlewares/validation/validate-request.middleware.js';
import { asyncHandler } from '@/common/middlewares/async-handler.middleware.js';
import { z } from 'zod';
import { asErrorBody } from './helpers/http-assertions.js';

describe('Global error handling', () => {
  it('returns a consistent ApiError response with details', async () => {
    const app = createErrorTestApp((testApp) => {
      testApp.get('/api-error', (_request, _response, next) => {
        next(new ApiError('Conflict happened', 409, [{ path: 'name', message: 'Name already exists' }]));
      });
    });

    const response = await request(app).get('/api-error').expect(409);
    const body = asErrorBody(response.body);

    expect(body).toEqual({
      success: false,
      message: 'Conflict happened',
      errors: [
        {
          path: 'name',
          message: 'Name already exists'
        }
      ]
    });
  });

  it('sanitizes generic internal errors', async () => {
    const app = createErrorTestApp((testApp) => {
      testApp.get(
        '/generic-error',
        asyncHandler(() => {
          throw new Error('Database password leaked');
        })
      );
    });

    const response = await request(app).get('/generic-error').expect(500);
    const body = asErrorBody(response.body);

    expect(body).toEqual({
      success: false,
      message: 'Internal server error'
    });
  });

  it('normalizes invalid status codes to 500', async () => {
    const app = createErrorTestApp((testApp) => {
      testApp.get('/invalid-status', (_request, _response, next) => {
        next({
          statusCode: 99,
          message: 'Invalid upstream status'
        });
      });
    });

    const response = await request(app).get('/invalid-status').expect(500);
    const body = asErrorBody(response.body);

    expect(body).toEqual({
      success: false,
      message: 'Internal server error'
    });
  });

  it('logs unexpected internal errors outside test environments', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const app = createErrorTestApp((testApp) => {
      testApp.get('/generic-error', (_request, _response, next) => {
        next(new Error('Production failure'));
      });
    });

    await request(app).get('/generic-error').expect(500);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Unhandled request error'), expect.any(Error));

    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('keeps route not-found responses in the shared error shape', async () => {
    const app = createErrorTestApp();

    const response = await request(app).get('/missing-route').expect(404);
    const body = asErrorBody(response.body);

    expect(body).toEqual({
      success: false,
      message: 'Route GET /missing-route not found'
    });
  });

  it('uses stable client-facing validation paths for nested and body-level issues', async () => {
    const app = createErrorTestApp((testApp) => {
      testApp.post(
        '/validated',
        express.json(),
        validateRequest(
          z.object({
            body: z
              .object({
                product: z.object({
                  name: z.string().min(1, 'Name is required')
                })
              })
              .refine(() => false, 'Body-level failure')
          })
        ),
        (_request, response) => response.status(204).send()
      );
    });

    const response = await request(app)
      .post('/validated')
      .send({
        product: {
          name: ''
        }
      })
      .expect(422);
    const body = asErrorBody(response.body);

    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'product.name' }),
        expect.objectContaining({ path: 'body' })
      ])
    );
  });
});

const createErrorTestApp = (configure?: (app: express.Express) => void): express.Express => {
  const app = express();

  configure?.(app);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
