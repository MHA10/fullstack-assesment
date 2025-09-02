import { INestApplication } from '@nestjs/common';

/**
 * Configures CORS (Cross-Origin Resource Sharing) settings for the application
 * @param app - The NestJS application instance
 */
export function setupCors(app: INestApplication): void {
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
}