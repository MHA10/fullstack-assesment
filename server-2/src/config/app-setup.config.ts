import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

/**
 * Configures global application settings including pipes, filters, and interceptors
 * @param app - The NestJS application instance
 */
export function setupGlobalConfiguration(app: INestApplication): void {
  // Global validation pipe with strict validation rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter for consistent error handling
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global logging interceptor for request/response logging
  app.useGlobalInterceptors(new LoggingInterceptor());
}