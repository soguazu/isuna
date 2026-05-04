import { createApp } from '../../app.js';
import { createTestEnv } from './test-env.js';
export const createTestApp = ({ databaseContext, ...envOverrides } = {}) => {
    const env = createTestEnv(envOverrides);
    return createApp(env, { databaseContext });
};
