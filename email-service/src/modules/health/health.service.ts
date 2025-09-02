import { Injectable, Logger } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly messagingService: MessagingService) {}

  async check() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const environment = process.env.NODE_ENV || 'development';
    const version = process.env.npm_package_version || '1.0.0';

    try {
      // Check messaging and email service health
      const serviceHealth = await this.messagingService.getServiceHealth();

      const healthStatus = {
        status: serviceHealth.status,
        timestamp,
        uptime,
        environment,
        version,
        services: {
          email: {
            status: serviceHealth.emailService ? 'connected' : 'disconnected',
          },
          messaging: {
            status: 'connected', // RabbitMQ consumer is running
          },
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
    const timestamp = new Date().toISOString();

    try {
      // Check if email service is ready
      const serviceHealth = await this.messagingService.getServiceHealth();
      
      if (serviceHealth.status === 'unhealthy') {
        throw new Error('Email service is not ready');
      }

      this.logger.log('Readiness check passed');
      return {
        status: 'ready',
        timestamp,
      };
    } catch (error) {
      this.logger.error('Readiness check failed', error.stack);
      throw new Error('Service not ready');
    }
  }

  async live() {
    const timestamp = new Date().toISOString();
    this.logger.log('Liveness check passed');
    return {
      status: 'alive',
      timestamp,
    };
  }

  async getEmailServiceInfo() {
    const timestamp = new Date().toISOString();
    
    try {
      const serviceHealth = await this.messagingService.getServiceHealth();
      
      return {
        status: serviceHealth.emailService ? 'connected' : 'disconnected',
        service: 'SMTP Email Service',
        host: process.env.SMTP_HOST || 'not configured',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        timestamp,
      };
    } catch (error) {
      this.logger.error('Failed to get email service info', error.stack);
      throw new Error('Failed to retrieve email service information');
    }
  }
}