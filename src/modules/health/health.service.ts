import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private dataSource: DataSource) {}

  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  async ready() {
    try {
      const isConnected = this.dataSource.isInitialized;
      return {
        status: isConnected ? 'ready' : 'not_ready',
        database: isConnected ? 'connected' : 'disconnected',
      };
    } catch (error) {
      return {
        status: 'not_ready',
        database: 'error',
        error: error.message,
      };
    }
  }
}
