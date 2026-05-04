import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { HealthStatus } from '@/modules/health/services/health.service.js';
import { asErrorBody, asSuccessBody } from './helpers/http-assertions.js';
import { createTestApp } from './helpers/test-app.js';

describe('GET /api/v1/health', () => {
  it('returns the backend health status from the versioned API', async () => {
    const app = createTestApp();

    const response = await request(app).get('/api/v1/health').expect(200);
    const body = asSuccessBody<HealthStatus>(response.body);

    expect(body).toMatchObject({
      success: true,
      data: {
        status: 'ok',
        apiVersion: 'v1',
        environment: 'test'
      }
    });
    expect(body.data.uptime).toEqual(expect.any(Number));
    expect(body.data.timestamp).toEqual(expect.any(String));
  });

  it('does not expose an unversioned health route', async () => {
    const app = createTestApp();

    const response = await request(app).get('/health').expect(404);
    const body = asErrorBody(response.body);

    expect(body).toMatchObject({
      success: false,
      message: 'Route GET /health not found'
    });
  });
});
