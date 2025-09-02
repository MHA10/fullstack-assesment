import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getEmailConfig } from '../../config/email.config';
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
  private emailConfig: any;

  constructor(private configService: ConfigService) {
    this.emailConfig = getEmailConfig(this.configService);
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport(this.emailConfig.smtp);
      this.logger.log('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize email transporter:',
        error.message,
      );
    }
  }

  async sendWelcomeEmail(payload: EmailNotificationPayload): Promise<void> {
    const startTime = Date.now();
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    this.logger.debug(`[EMAIL_SEND] Starting email sending process [${emailId}]`);
    this.logger.debug(`[EMAIL_SEND] Sending welcome email to: ${payload.email}`, {
      emailId,
      userId: payload.userId,
      fullName: payload.fullName
    });

    try {
      const mailOptions = {
        from: `${this.emailConfig.from.name} <${this.emailConfig.from.email}>`,
        to: payload.email,
        subject: 'Welcome! Your account has been created successfully',
        html: this.generateWelcomeEmailTemplate(payload),
      };

      this.logger.debug(`[EMAIL_SEND] Sending email via SMTP [${emailId}]`);
      const result = await this.transporter.sendMail(mailOptions);
      
      const duration = Date.now() - startTime;
      this.logger.log(
        `[EMAIL_SEND] Welcome email sent successfully to ${payload.email} [${emailId}] (${duration}ms)`,
      );
      this.logger.debug(`[EMAIL_SEND] Email delivered successfully`, {
        emailId,
        messageId: result.messageId,
        duration: `${duration}ms`
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `[EMAIL_SEND] Failed to send welcome email to ${payload.email} [${emailId}] (${duration}ms):`,
        error.message,
      );
      this.logger.error(`[EMAIL_SEND] Email error details [${emailId}]:`, {
        errorCode: error.code,
        errorCommand: error.command,
        errorResponse: error.response
      });
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
    const verificationId = `verify_${Date.now()}`;
    this.logger.debug(`[SMTP_VERIFY] Starting SMTP connection verification [${verificationId}]`);
    
    try {
      const startTime = Date.now();
      await this.transporter.verify();
      const duration = Date.now() - startTime;
      
      this.logger.log(`[SMTP_VERIFY] SMTP connection verified successfully [${verificationId}] (${duration}ms)`);
      this.logger.debug(`[SMTP_VERIFY] SMTP configuration validated`, {
        verificationId,
        host: this.emailConfig.smtp.host,
        port: this.emailConfig.smtp.port,
        secure: this.emailConfig.smtp.secure
      });
      return true;
    } catch (error) {
      this.logger.error(`[SMTP_VERIFY] SMTP connection verification failed [${verificationId}]:`, error.message);
      this.logger.error(`[SMTP_VERIFY] Verification error details [${verificationId}]:`, {
        errorCode: error.code,
        errorCommand: error.command,
        errorResponse: error.response
      });
      return false;
    }
  }
}
