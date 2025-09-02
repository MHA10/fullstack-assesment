import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupGlobalConfiguration } from './config/app-setup.config';
import { setupCors } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';
import { setupMicroservice } from './config/microservice.config';

/**
 * Bootstrap function to initialize and start the Email Service application
 * Configures global settings, CORS, Swagger documentation, and RabbitMQ microservice
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  try {
    // Configure global application settings
    setupGlobalConfiguration(app);

    // Configure CORS
    setupCors(app);

    // Setup API documentation
    setupSwagger(app);

    // Setup and start microservice
    await setupMicroservice(app, logger);

    // Start HTTP server
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`Email service is running on port ${port}`);
    logger.log(`API documentation available at http://localhost:${port}/api/docs`);
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();
