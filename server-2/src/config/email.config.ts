export const emailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: {
    name: process.env.SMTP_FROM_NAME || 'User Management System',
    email: process.env.SMTP_FROM_EMAIL || 'noreply@yourcompany.com',
  },
};

export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  queue: process.env.RABBITMQ_QUEUE || 'email_notifications',
};