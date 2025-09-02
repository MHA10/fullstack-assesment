# User Management Server (SERVER-1)

A robust NestJS-based backend service for user management with email notification capabilities via RabbitMQ.

## Features

- ✅ **User Creation**: Create users with fullName, email, and message
- ✅ **Email Notifications**: Automatic email notification queuing via RabbitMQ
- ✅ **Data Validation**: Comprehensive input validation with class-validator
- ✅ **Database Integration**: PostgreSQL with TypeORM
- ✅ **API Documentation**: Swagger/OpenAPI documentation
- ✅ **Health Checks**: Health, readiness, and liveness endpoints
- ✅ **Error Handling**: Proper error responses and logging
- ✅ **CORS Support**: Configured for frontend integration
- ✅ **Security Headers**: Basic security headers implementation

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Message Queue**: RabbitMQ
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- RabbitMQ (v3.8 or higher)
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=user_management
   
   RABBITMQ_URL=amqp://localhost:5672
   RABBITMQ_QUEUE=email_notifications
   
   FRONTEND_URL=http://localhost:3001
   ```

3. **Set up PostgreSQL database**:
   ```sql
   CREATE DATABASE user_management;
   ```

4. **Start RabbitMQ** (if not already running):
   ```bash
   # On macOS with Homebrew
   brew services start rabbitmq
   
   # On Ubuntu/Debian
   sudo systemctl start rabbitmq-server
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

## Database Configuration

### Entity Management
This project uses a scalable entity configuration approach:

- **Centralized Entity Index**: All entities are exported from `src/entities/index.ts`
- **Auto-Discovery**: The database configuration automatically imports all entities from the index file
- **Scalable**: When adding new entities, simply export them from the index file

#### Adding New Entities
1. Create your entity file in the appropriate module (e.g., `src/modules/products/entity/product.entity.ts`)
2. Export it from `src/entities/index.ts`:
   ```typescript
   export { Product } from '../modules/products/entity/product.entity';
   ```
3. The entity will be automatically included in TypeORM configuration

## Database Migrations

This project includes TypeORM migration commands for managing database schema changes:

### Generate Migration
Create a new migration file based on entity changes:
```bash
npm run migration:generate --name=migration-name
```

Example:
```bash
npm run migration:generate --name=users-init
```

### Run Migrations
Execute pending migrations:
```bash
npm run migration:run
```

### Revert Migration
Revert the last executed migration:
```bash
npm run migration:revert
```

### Migration Best Practices
- Always generate migrations when making entity changes
- Test migrations in development before production deployment
- Keep migration files in version control
- Use descriptive names for migration files
- Set `synchronize: false` in production and use migrations instead

## API Endpoints

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### Health Checks
- `GET /health` - Comprehensive health check
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### API Documentation
- `GET /api/docs` - Swagger UI (development only)

## API Usage Examples

### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "message": "Hello, I would like to join your platform!"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/users
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Message Queue Integration

When a user is successfully created, the server publishes a message to RabbitMQ with the following structure:

```json
{
  "userId": 1,
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "message": "Hello, I would like to join your platform!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Validation Rules

### CreateUserDto
- **fullName**: Required, string, 2-255 characters
- **email**: Required, valid email format, max 255 characters, unique
- **message**: Required, string, 10-1000 characters

## Requirements Compliance

✅ **User Creation**: Implements POST endpoint accepting fullName, email, and message  
✅ **Database Storage**: Stores user data in PostgreSQL with proper schema  
✅ **Email Notification**: Publishes messages to RabbitMQ for SERVER-2 consumption  
✅ **Error Handling**: Comprehensive error handling and validation  
✅ **API Documentation**: Swagger documentation available  
✅ **Production Ready**: Includes logging, health checks, and security measures
