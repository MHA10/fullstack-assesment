import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig } from '../../config/email.config';
import { Transporter } from 'nodemailer';

export interface EmailNotificationPayload {
  userId: string;
  email: string;
  fullName: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport(emailConfig.smtp);
      this.logger.log('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize email transporter:',
        error.message,
      );
    }
  }

  async sendWelcomeEmail(payload: EmailNotificationPayload): Promise<void> {
    try {
      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: payload.email,
        subject: 'Welcome! Your account has been created successfully',
        html: this.generateWelcomeEmailTemplate(payload),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Welcome email sent successfully to ${payload.email}. Message ID: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${payload.email}:`,
        error.message,
      );
      throw error;
    }
  }

  private generateWelcomeEmailTemplate(
    payload: EmailNotificationPayload,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Our Platform</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Platform!</h1>
          </div>
          <div class="content">
            <h2>Hello ${payload.fullName}!</h2>
            <p>Thank you for joining our platform. Your account has been created successfully.</p>
            <p><strong>Your message:</strong> ${payload.message}</p>
            <p>We're excited to have you on board and look forward to providing you with an excellent experience.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>This email was sent on ${payload.timestamp.toLocaleString()}</p>
            <p>© 2025 Our Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('SMTP connection verification failed:', error.message);
      return false;
    }
  }
}
