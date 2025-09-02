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
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ successfully');
    } catch (error) {
      this.logger.warn('Failed to connect to RabbitMQ (continuing without messaging):', error.message);
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
    try {
      await this.publishMessage('email_notifications', payload);
      this.logger.log(`Email notification sent for user: ${payload.email}`);
    } catch (error) {
      this.logger.warn('Failed to publish email notification (RabbitMQ unavailable):', error.message);
      // Don't throw error to allow operation to continue
    }
  }

  private async publishMessage(pattern: string, data: any): Promise<void> {
    try {
      return this.client.emit(pattern, data).toPromise();
    } catch (error) {
      this.logger.warn(`Failed to publish message to pattern '${pattern}':`, error.message);
      // Don't throw error to allow operation to continue
    }
  }
}