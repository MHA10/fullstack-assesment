import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Swagger decorator for Health module tag
 */
export const ApiHealthTags = () => applyDecorators(ApiTags('health'));

/**
 * Swagger decorator for Health Check endpoint
 */
export const ApiHealthCheck = () =>
  applyDecorators(
    ApiOperation({ summary: 'Health check endpoint' }),
    ApiResponse({
      status: 200,
      description: 'Application is healthy',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          uptime: { type: 'number', example: 123.456 },
          environment: { type: 'string', example: 'development' },
          version: { type: 'string', example: '1.0.0' },
          database: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'connected' },
              responseTime: { type: 'number', example: 5.2 },
            },
          },
          messaging: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'connected' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 503,
      description: 'Service unavailable - health check failed',
    }),
  );

/**
 * Swagger decorator for Readiness Probe endpoint
 */
export const ApiReadinessProbe = () =>
  applyDecorators(
    ApiOperation({ summary: 'Readiness probe endpoint' }),
    ApiResponse({
      status: 200,
      description: 'Application is ready to serve requests',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ready' },
          timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: 503,
      description: 'Service unavailable - application not ready',
    }),
  );

/**
 * Swagger decorator for Liveness Probe endpoint
 */
export const ApiLivenessProbe = () =>
  applyDecorators(
    ApiOperation({ summary: 'Liveness probe endpoint' }),
    ApiResponse({
      status: 200,
      description: 'Application is alive',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'alive' },
          timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
  );

/**
 * Swagger decorator for Database Info endpoint
 */
export const ApiDatabaseInfo = () =>
  applyDecorators(
    ApiOperation({ summary: 'Database connection details' }),
    ApiResponse({
      status: 200,
      description: 'Database connection information',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'connected' },
          host: { type: 'string', example: 'localhost' },
          port: { type: 'number', example: 5432 },
          database: { type: 'string', example: 'temp' },
          username: { type: 'string', example: 'postgres' },
          type: { type: 'string', example: 'postgres' },
          isConnected: { type: 'boolean', example: true },
          timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
  );
