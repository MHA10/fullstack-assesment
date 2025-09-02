import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

/**
 * Configures global application settings including pipes, filters, and interceptors
 * @param app - The NestJS application instance
 */
export function setupGlobalConfiguration(app: INestApplication): void {
    // Global exception filter for consistent error handling
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global logging interceptor for request/response logging
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Global validation pipe with comprehensive validation rules
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip properties that don't have decorators
            forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
            transform: true, // Automatically transform payloads to DTO instances
            skipMissingProperties: false, // Validate missing properties
            disableErrorMessages: process.env.NODE_ENV === 'production',
            validationError: {
                target: false,
                value: false,
            },
        }),
    );
}