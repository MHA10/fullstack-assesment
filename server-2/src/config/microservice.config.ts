import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getRabbitmqConfig } from './email.config';

/**
 * Configures and connects the RabbitMQ microservice
 * @param app - The NestJS application instance
 * @param logger - Logger instance for logging microservice events
 */
export async function setupMicroservice(
  app: INestApplication,
  logger: Logger,
): Promise<void> {
  // Get ConfigService and RabbitMQ config
  const configService = app.get(ConfigService);
  const rabbitmqConfig = getRabbitmqConfig(configService);

  // Connect microservice for RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqConfig.url],
      queue: rabbitmqConfig.queue,
      queueOptions: {
        durable: true,
      },
    },
  });

  // Start microservice
  await app.startAllMicroservices();
  logger.log('Email microservice started successfully');
}