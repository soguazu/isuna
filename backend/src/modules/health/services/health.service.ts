import type { AppEnv } from '@/config/env.js';

export type HealthStatus = {
  status: 'ok';
  apiVersion: 'v1';
  environment: string;
  uptime: number;
  timestamp: string;
};

export class HealthService {
  constructor(private readonly env: AppEnv) {}

  getStatus(): HealthStatus {
    return {
      status: 'ok',
      apiVersion: 'v1',
      environment: this.env.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
