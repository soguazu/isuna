export const createTestEnv = (overrides = {}) => ({
    nodeEnv: 'test',
    port: 4000,
    databasePath: ':memory:',
    ...overrides
});
