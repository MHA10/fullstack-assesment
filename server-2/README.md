# Email Service (Server-2)

A NestJS-based microservice for handling email notifications in the User Management System. This service consumes messages from RabbitMQ and sends email notifications using SMTP.

## Architecture Overview

This email service is designed as a microservice that:
- Consumes email notification messages from RabbitMQ
- Sends welcome emails to newly registered users
- Provides health check endpoints for monitoring
- Integrates with the main user management service (server-1)

## Features

- **RabbitMQ Consumer**: Listens for email notification messages
- **SMTP Email Service**: Sends HTML emails using Nodemailer
- **Health Checks**: Comprehensive health monitoring endpoints
- **Swagger Documentation**: Auto-generated API documentation
- **Global Error Handling**: Consistent error responses and logging
- **Request Logging**: Detailed request/response logging
- **Environment Configuration**: Flexible configuration management

## Project Structure

```
src/
├── common/
│   ├── filters/
│   │   └── global-exception.filter.ts
│   └── interceptors/
│       └── logging.interceptor.ts
├── config/
│   ├── email.config.ts
│   └── logger.config.ts
├── modules/
│   ├── email/
│   │   ├── email.module.ts
│   │   └── email.service.ts
│   ├── health/
│   │   ├── decorators/
│   │   │   └── swagger.decorators.ts
│   │   ├── health.controller.ts
│   │   ├── health.module.ts
│   │   └── health.service.ts
│   └── messaging/
│       ├── messaging.module.ts
│       └── messaging.service.ts
├── app.module.ts
└── main.ts
```

## Environment Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Email Service Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_NAME=User Management System
   SMTP_FROM_EMAIL=noreply@yourcompany.com
   
   # RabbitMQ Configuration
   RABBITMQ_URL=amqp://localhost:5672
   RABBITMQ_QUEUE=email_notifications
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000
   ```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## API Endpoints

### Health Check Endpoints

- `GET /health` - Overall service health
- `GET /health/readiness` - Service readiness check
- `GET /health/liveness` - Service liveness check
- `GET /health/email` - Email service specific health

### Documentation

- `GET /api/docs` - Swagger API documentation

## Email Templates

The service currently supports:
- **Welcome Email**: Sent when a new user registers

Email templates are generated dynamically with user information and include:
- Personalized greeting
- Account creation confirmation
- Professional HTML formatting

## RabbitMQ Integration

### Message Format

The service expects messages in the following format:

```typescript
interface EmailNotificationPayload {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
}
```

### Queue Configuration

- **Queue Name**: `email_notifications`
- **Durable**: `true`
- **Transport**: RabbitMQ (AMQP)

## Monitoring and Logging

### Health Checks

The service provides comprehensive health checks:
- Application status
- Email service connectivity
- RabbitMQ connection status

### Logging

- Request/response logging with timing
- Error logging with stack traces
- Service startup and shutdown events
- Email sending success/failure logs

## Error Handling

- Global exception filter for consistent error responses
- Graceful handling of SMTP failures
- RabbitMQ connection error recovery
- Validation errors for malformed payloads

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Docker Support

The service can be containerized using the provided Dockerfile:

```bash
# Build image
docker build -t email-service .

# Run container
docker run -p 3001:3001 --env-file .env email-service
```

### Production Considerations

1. **SMTP Configuration**: Use production SMTP service (SendGrid, AWS SES, etc.)
2. **RabbitMQ**: Use managed RabbitMQ service or cluster
3. **Environment Variables**: Use secure secret management
4. **Monitoring**: Integrate with monitoring solutions (Prometheus, DataDog)
5. **Scaling**: Deploy multiple instances behind a load balancer

## Integration with Server-1

This service integrates with the main user management service (server-1):

1. Server-1 publishes messages to RabbitMQ when users are created
2. This service consumes those messages and sends welcome emails
3. Both services share the same RabbitMQ instance and queue configuration

## Troubleshooting

### Common Issues

1. **SMTP Authentication Errors**:
   - Verify SMTP credentials
   - Enable "Less secure app access" for Gmail
   - Use app-specific passwords for Gmail

2. **RabbitMQ Connection Issues**:
   - Ensure RabbitMQ is running
   - Check connection URL and credentials
   - Verify queue exists and is accessible

3. **Port Conflicts**:
   - Default port is 3001
   - Change PORT environment variable if needed

### Logs

Check application logs for detailed error information:
```bash
# View logs in development
npm run start:dev

# View logs in production
pm2 logs email-service
```

## Contributing

1. Follow NestJS best practices
2. Add tests for new features
3. Update documentation
4. Follow existing code style and patterns

## License

MIT License
