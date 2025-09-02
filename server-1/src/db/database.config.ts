import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import * as entities from '../entities';

// Base database configuration
export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'temp',
  entities: Object.values(entities),
  logging: process.env.NODE_ENV === 'development',
};

// Configuration for NestJS TypeORM module
export const nestTypeOrmConfig: TypeOrmModuleOptions = {
  ...databaseConfig,
  synchronize: process.env.NODE_ENV === 'development', // Only sync in development
  autoLoadEntities: true,
};

// Configuration for TypeORM CLI and migrations
export const typeOrmConfig: DataSourceOptions = {
  ...databaseConfig,
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false, // Never sync when using migrations
  migrationsRun: false,
};
