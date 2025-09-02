import { ConfigService } from '@nestjs/config';

export const getEmailConfig = (configService: ConfigService) => ({
  smtp: {
    host: configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
    port: configService.get<number>('SMTP_PORT', 587),
    secure: configService.get<string>('SMTP_SECURE', 'false') === 'true',
    auth: {
      user: configService.get<string>('SMTP_USER'),
      pass: configService.get<string>('SMTP_PASS'),
    },
  },
  from: {
    name: configService.get<string>('SMTP_FROM_NAME', 'User Management System'),
    email: configService.get<string>(
      'SMTP_FROM_EMAIL',
      'noreply@yourcompany.com',
    ),
  },
});

export const getRabbitmqConfig = (configService: ConfigService) => ({
  url: configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
  queue: configService.get<string>('RABBITMQ_QUEUE', 'email_notifications'),
});
