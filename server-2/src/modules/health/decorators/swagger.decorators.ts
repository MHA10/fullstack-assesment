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
    ApiOperation({ summary: 'Health check endpoint for email microservice' }),
    ApiResponse({
      status: 200,
      description: 'Email microservice is healthy',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          uptime: { type: 'number', example: 123.456 },
          environment: { type: 'string', example: 'development' },
          version: { type: 'string', example: '1.0.0' },
          services: {
            type: 'object',
            properties: {
              email: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'connected' },
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
      description: 'Email microservice is ready to serve requests',
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
      description: 'Email microservice is alive',
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
 * Swagger decorator for Email Service Info endpoint
 */
export const ApiEmailServiceInfo = () =>
  applyDecorators(
    ApiOperation({ summary: 'Email service connection details' }),
    ApiResponse({
      status: 200,
      description: 'Email service connection information',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'connected' },
          service: { type: 'string', example: 'SMTP Email Service' },
          host: { type: 'string', example: 'smtp.gmail.com' },
          port: { type: 'number', example: 587 },
          secure: { type: 'boolean', example: false },
          timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    }),
  );