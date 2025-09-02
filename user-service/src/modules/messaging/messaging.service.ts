import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

export interface EmailNotificationPayload {
  userId: string;
  email: string;
  fullName: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'email_notifications',
        queueOptions: {
          durable: true,
        },
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      this.logger.debug('[RABBITMQ] Attempting to connect to RabbitMQ...', {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: 'email_notifications'
      });
      await this.client.connect();
      this.logger.log('[RABBITMQ] Connected to RabbitMQ successfully');
    } catch (error) {
      this.logger.warn('[RABBITMQ] Failed to connect to RabbitMQ (continuing without messaging):', error.message);
      // Don't throw error to allow server to start without RabbitMQ
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection:', error.message);
    }
  }

  async publishEmailNotification(payload: EmailNotificationPayload): Promise<void> {
    this.logger.debug('[RABBITMQ] Publishing email notification to RabbitMQ', {
      userId: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      timestamp: payload.timestamp,
      pattern: 'email_notifications'
    });
    
    try {
      await this.publishMessage('email_notifications', payload);
      this.logger.log(`[RABBITMQ] Email notification published successfully for user: ${payload.email}`);
    } catch (error) {
      this.logger.error('[RABBITMQ] Failed to publish email notification (RabbitMQ unavailable):', {
        error: error.message,
        payload: { userId: payload.userId, email: payload.email }
      });
      // Don't throw error to allow operation to continue
    }
  }

  private async publishMessage(pattern: string, data: any): Promise<void> {
    try {
      this.logger.debug(`[RABBITMQ] Emitting message to pattern: ${pattern}`, {
        pattern,
        dataKeys: Object.keys(data),
        timestamp: new Date().toISOString()
      });
      
      const result = await this.client.emit(pattern, data).toPromise();
      
      this.logger.debug(`[RABBITMQ] Message emitted successfully to pattern: ${pattern}`);
      return result;
    } catch (error) {
      this.logger.error(`[RABBITMQ] Failed to publish message to pattern '${pattern}':`, {
        error: error.message,
        pattern,
        stack: error.stack
      });
      // Don't throw error to allow operation to continue
    }
  }
}