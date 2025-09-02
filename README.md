# User Registration Portal - Full Stack Application

A complete user registration system with email notifications, built using modern web technologies and microservices architecture.

## 🏗️ System Architecture

This project consists of three main applications:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │───▶│  User Service   │───▶│ Email Service   │
│   (Next.js)     │    │   (NestJS)      │    │   (NestJS)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
      Port 3000           Port 4000            Port 4001
                              │                      ▲
                              ▼                      │
                        ┌─────────────┐    ┌─────────────────┐
                        │             │    │                 │
                        │ PostgreSQL  │    │   RabbitMQ      │
                        │ Database    │    │ Message Queue   │
                        │             │    │                 │
                        └─────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
machine-round/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── package.json
├── user-service/          # NestJS user management service
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── entities/      # Database entities
│   │   ├── db/           # Database configuration
│   │   └── config/       # Application configuration
│   └── package.json
├── email-service/         # NestJS email notification service
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   └── config/       # Application configuration
│   └── package.json
└── README.md             # This file
```

## 🚀 Applications Overview

### Frontend (Next.js)
- **Port**: 3000
- **Technology**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Features**:
  - User registration form with validation
  - Auto-dismissing success/error notifications
  - Responsive design with custom UI components
  - Form validation with real-time feedback

### User Service (NestJS)
- **Port**: 4000
- **Technology**: NestJS, TypeScript, PostgreSQL, TypeORM
- **Features**:
  - RESTful API for user management
  - PostgreSQL database integration
  - User creation and validation
  - RabbitMQ message publishing
  - Swagger API documentation
  - Health check endpoints

### Email Service (NestJS)
- **Port**: 3001
- **Technology**: NestJS, TypeScript, RabbitMQ, Nodemailer
- **Features**:
  - Email notification processing
  - RabbitMQ message consumption
  - SMTP email delivery
  - Microservice architecture
  - Health check endpoints

## 🔄 Workflow

1. **User Registration**: User fills out the registration form on the frontend
2. **API Call**: Frontend sends POST request to User Service
3. **Database Storage**: User Service validates and stores user data in PostgreSQL
4. **Message Queue**: User Service publishes a message to RabbitMQ
5. **Email Processing**: Email Service consumes the message and sends welcome email
6. **Notification**: User receives confirmation on the frontend

## 🛠️ Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **RabbitMQ** message broker
- **SMTP** email configuration (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd machine-round

# Install dependencies for all services
cd frontend && npm install && cd ..
cd user-service && npm install && cd ..
cd email-service && npm install && cd ..
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in each service directory and configure:

**Frontend (.env)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**User Service (.env)**:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/userdb
RABBITMQ_URL=amqp://localhost:5672
PORT=4000
```

**Email Service (.env)**:
```env
RABBITMQ_URL=amqp://localhost:5672
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
PORT=3001
```

### 3. Database Setup

```bash
# Start PostgreSQL and create database
psql -U postgres
CREATE DATABASE userdb;

# Run migrations (from user-service directory)
cd user-service
npm run migration:run
```

### 4. Start Services

Open three terminal windows and run:

```bash
# Terminal 1: Start User Service
cd user-service
npm run start:dev

# Terminal 2: Start Email Service
cd email-service
npm run start:dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **User Service API**: http://localhost:4000
- **Email Service API**: http://localhost:3001
- **User Service Swagger**: http://localhost:4000/api
- **Email Service Swagger**: http://localhost:3001/api

## 📚 API Documentation

### User Service Endpoints

- `POST /users` - Create a new user
- `GET /health` - Health check
- `GET /api` - Swagger documentation

### Email Service Endpoints

- `GET /health` - Health check
- `GET /api` - Swagger documentation

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Services
```bash
npm run start:dev    # Start development server
npm run start:prod   # Start production server
npm run build        # Build the application
npm run lint         # Run ESLint
```



## 🔒 Security Features

- Input validation and sanitization
- CORS configuration
- Environment variable protection
- SQL injection prevention
- Rate limiting (configurable)

## 📈 Monitoring & Health Checks

- Health check endpoints for all services
- Structured logging
- Error handling and reporting
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure PostgreSQL is running and credentials are correct
2. **RabbitMQ Connection Error**: Verify RabbitMQ is installed and running
3. **Email Not Sending**: Check SMTP configuration and credentials
4. **Port Already in Use**: Change ports in environment variables

### Support

For issues and questions, please check the individual service README files or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**