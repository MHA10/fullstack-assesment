import { DataSource } from 'typeorm';
import { typeOrmConfig } from './database.config';

const AppDataSource = new DataSource(typeOrmConfig);

export default AppDataSource;