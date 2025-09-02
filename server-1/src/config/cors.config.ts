import { INestApplication } from '@nestjs/common';

/**
 * Configures CORS (Cross-Origin Resource Sharing) and security headers for the application
 * @param app - The NestJS application instance
 */
export function setupCorsAndSecurity(app: INestApplication): void {
  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Security headers middleware
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });
}