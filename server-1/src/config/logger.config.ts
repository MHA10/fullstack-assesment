import { LoggerService, LogLevel } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  log(message: any, context?: string): void {
    this.printMessage('LOG', message, context);
  }

  error(message: any, trace?: string, context?: string): void {
    this.printMessage('ERROR', message, context, trace);
  }

  warn(message: any, context?: string): void {
    this.printMessage('WARN', message, context);
  }

  debug(message: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.printMessage('DEBUG', message, context);
    }
  }

  verbose(message: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.printMessage('VERBOSE', message, context);
    }
  }

  private printMessage(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    const logLevel = this.getColoredLevel(level);

    console.log(`[${timestamp}] [${logLevel}] [${ctx}] ${message}`);

    if (trace) {
      console.log(trace);
    }
  }

  private getColoredLevel(level: string): string {
    const colors = {
      LOG: '\x1b[32m', // Green
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m', // Yellow
      DEBUG: '\x1b[36m', // Cyan
      VERBOSE: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';

    return `${colors[level] || ''}${level}${reset}`;
  }
}

export const loggerConfig = {
  logLevels: ['error', 'warn', 'log', 'debug', 'verbose'] as LogLevel[],
  timestamp: true,
};
