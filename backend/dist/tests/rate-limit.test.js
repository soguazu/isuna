import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { asErrorBody } from './helpers/http-assertions.js';
import { createTestApp } from './helpers/test-app.js';
describe('Rate limiting', () => {
    it('returns 429 after the configured request limit is exceeded', async () => {
        const app = createTestApp({
            rateLimitWindowMs: 60_000,
            rateLimitMaxRequests: 2
        });
        await request(app).get('/api/v1/health').expect(200);
        await request(app).get('/api/v1/health').expect(200);
        const response = await request(app).get('/api/v1/health').expect(429);
        expect(response.headers['retry-after']).toBeDefined();
        expect(asErrorBody(response.body).message).toBe('Too many requests');
    });
});
