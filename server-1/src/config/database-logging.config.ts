import { Logger } from '@nestjs/common';
import { databaseConfig } from '../db/database.config';

/**
 * Logs database connection details in a formatted table
 * @param logger - Logger instance for database connection logging
 */
export function logDatabaseConnection(logger: Logger): void {
  logger.log('🗄️  Database Connection Details:');
  console.table({
    Host: databaseConfig.host,
    Port: databaseConfig.port,
    Database: databaseConfig.database,
    Username: databaseConfig.username,
    Password: '*'.repeat(databaseConfig.password?.length || 0),
  });
  logger.log('');
}