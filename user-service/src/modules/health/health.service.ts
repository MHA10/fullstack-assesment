import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../../db/database.config';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async check() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const environment = process.env.NODE_ENV || 'development';
    const version = process.env.npm_package_version || '1.0.0';

    try {
      // Check database connection
      const dbStart = Date.now();
      await this.dataSource.query('SELECT 1');
      const dbResponseTime = Date.now() - dbStart;

      const healthStatus = {
        status: 'ok',
        timestamp,
        uptime,
        environment,
        version,
        database: {
          status: 'connected',
          responseTime: dbResponseTime,
        },
        messaging: {
          status: 'connected', // Assume RabbitMQ is connected for now
        },
      };

      this.logger.log('Health check passed');
      return healthStatus;
    } catch (error) {
      this.logger.error('Health check failed', error.stack);
      throw new Error('Health check failed');
    }
  }

  async ready() {
    try {
      // Check if application is ready to serve requests
      await this.dataSource.query('SELECT 1');

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Readiness check failed', error.stack);
      throw new Error('Application not ready');
    }
  }

  async live() {
    // Simple liveness check - just return that the service is alive
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  async getDatabaseInfo() {
    try {
      // Test database connection
      await this.dataSource.query('SELECT 1');
      const isConnected = this.dataSource.isInitialized;

      return {
        status: isConnected ? 'connected' : 'disconnected',
        host: databaseConfig.host,
        port: databaseConfig.port,
        database: databaseConfig.database,
        username: databaseConfig.username,
        type: 'postgres',
        isConnected,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get database info', error.stack);
      return {
        status: 'error',
        host: databaseConfig.host,
        port: databaseConfig.port,
        database: databaseConfig.database,
        username: databaseConfig.username,
        type: 'postgres',
        isConnected: false,
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
