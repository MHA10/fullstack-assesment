import { Controller, Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../email/email.service';
import type { EmailNotificationPayload } from '../email/email.service';

@Controller()
@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(private emailService: EmailService) {}

  @MessagePattern('email_notifications')
  async handleEmailNotification(
    @Payload() payload: EmailNotificationPayload,
  ): Promise<void> {
    const startTime = Date.now();
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    this.logger.debug('[RABBITMQ] Received RabbitMQ message', {
      messageId,
      pattern: 'email_notifications',
      timestamp: new Date().toISOString(),
      payloadKeys: payload ? Object.keys(payload) : [],
    });

    try {
      this.logger.log(
        `[EMAIL_PROCESSING] Processing email notification for user: ${payload?.email || 'unknown'} [${messageId}]`,
      );

      // Validate payload
      this.logger.debug('[VALIDATION] Validating message payload', {
        messageId,
        userId: payload?.userId,
        email: payload?.email,
        fullName: payload?.fullName,
        hasMessage: !!payload?.message,
        timestamp: payload?.timestamp,
      });

      if (!this.isValidEmailPayload(payload)) {
        this.logger.error(
          '[VALIDATION] Invalid email notification payload received',
          {
            messageId,
            payload,
            validationFailed: true,
          },
        );
        throw new Error('Invalid email notification payload');
      }

      this.logger.debug('[VALIDATION] Payload validation successful', {
        messageId,
      });

      // Send welcome email
      const emailStartTime = Date.now();
      this.logger.debug('[EMAIL_SERVICE] Delegating to email service', {
        messageId,
        email: payload.email,
        fullName: payload.fullName,
      });

      await this.emailService.sendWelcomeEmail(payload);

      const emailTime = Date.now() - emailStartTime;
      const totalTime = Date.now() - startTime;

      this.logger.log(
        `[EMAIL_PROCESSING] Email notification processed successfully for user: ${payload.email} [${messageId}] (Email: ${emailTime}ms, Total: ${totalTime}ms)`,
      );
    } catch (error) {
      const totalTime = Date.now() - startTime;
      this.logger.error(
        `[EMAIL_PROCESSING] Failed to process email notification [${messageId}] (${totalTime}ms):`,
        {
          messageId,
          email: payload?.email || 'unknown',
          error: error.message,
          stack: error.stack,
          payload: payload
            ? {
                userId: payload.userId,
                email: payload.email,
                fullName: payload.fullName,
              }
            : null,
        },
      );
      throw error;
    }
  }

  private isValidEmailPayload(
    payload: any,
  ): payload is EmailNotificationPayload {
    return (
      (payload &&
        typeof payload.userId === 'string' &&
        typeof payload.email === 'string' &&
        typeof payload.fullName === 'string' &&
        typeof payload.message === 'string' &&
        payload.timestamp instanceof Date) ||
      typeof payload.timestamp === 'string'
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
