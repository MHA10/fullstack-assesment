import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../email/email.service';
import type { EmailNotificationPayload } from '../email/email.service';
import { rabbitmqConfig } from '../../config/email.config';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(private emailService: EmailService) {}

  @MessagePattern('email_notifications')
  async handleEmailNotification(@Payload() payload: EmailNotificationPayload): Promise<void> {
    try {
      this.logger.log(`Received email notification for user: ${payload.email}`);
      
      // Validate payload
      if (!this.isValidEmailPayload(payload)) {
        this.logger.error('Invalid email notification payload received', payload);
        throw new Error('Invalid email notification payload');
      }

      // Send welcome email
      await this.emailService.sendWelcomeEmail(payload);
      
      this.logger.log(`Email notification processed successfully for user: ${payload.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to process email notification for user: ${payload?.email || 'unknown'}`,
        error.stack
      );
      throw error;
    }
  }

  private isValidEmailPayload(payload: any): payload is EmailNotificationPayload {
    return (
      payload &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.fullName === 'string' &&
      typeof payload.message === 'string' &&
      payload.timestamp instanceof Date || typeof payload.timestamp === 'string'
    );
  }

  async getServiceHealth(): Promise<{ status: string; emailService: boolean }> {
    try {
      const emailServiceHealthy = await this.emailService.verifyConnection();
      
      return {
        status: emailServiceHealthy ? 'healthy' : 'degraded',
        emailService: emailServiceHealthy,
      };
    } catch (error) {
      this.logger.error('Health check failed:', error.message);
      return {
        status: 'unhealthy',
        emailService: false,
      };
    }
  }
}