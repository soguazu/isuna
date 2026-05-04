export class HealthService {
    env;
    constructor(env) {
        this.env = env;
    }
    getStatus() {
        return {
            status: 'ok',
            apiVersion: 'v1',
            environment: this.env.nodeEnv,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
}
