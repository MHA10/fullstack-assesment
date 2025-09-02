import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { CustomLogger } from './config/logger.config';
import { setupGlobalConfiguration } from './config/app-setup.config';
import { setupCorsAndSecurity } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';
import { logDatabaseConnection } from './config/database-logging.config';

/**
 * Bootstrap function to initialize and start the User Management API application
 * Configures global settings, CORS, security headers, Swagger documentation, and database logging
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: new CustomLogger(),
    });

    // Configure global application settings
    setupGlobalConfiguration(app);

    // Configure CORS and security headers
    setupCorsAndSecurity(app);

    // Setup API documentation
    setupSwagger(app);

    // Start HTTP server
    const port = process.env.PORT || 3000;
    await app.listen(port);

    // Log database connection details
    logDatabaseConnection(logger);

    // Log application startup information
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    if (process.env.NODE_ENV !== 'production') {
      logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    }
  } catch (error) {
    logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();
