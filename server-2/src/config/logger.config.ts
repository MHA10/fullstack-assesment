import { LoggerService, LogLevel } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  log(message: any, context?: string): void {
    this.printMessage(message, 'LOG', context);
  }

  error(message: any, trace?: string, context?: string): void {
    this.printMessage(message, 'ERROR', context);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string): void {
    this.printMessage(message, 'WARN', context);
  }

  debug(message: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.printMessage(message, 'DEBUG', context);
    }
  }

  verbose(message: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.printMessage(message, 'VERBOSE', context);
    }
  }

  private printMessage(message: any, level: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'EmailService';
    const pid = process.pid;
    
    console.log(`[Nest] ${pid}  - ${timestamp}     ${level} [${ctx}] ${message}`);
  }
}

export const loggerConfig = {
  levels: ['error', 'warn', 'log', 'debug', 'verbose'] as LogLevel[],
  isGlobal: true,
};