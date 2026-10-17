import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: process.env.MYSQL_HOST ?? 'mysql',
      port: Number(process.env.MYSQL_PORT ?? 3306),
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      entities: [__dirname + '/../../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migration/*{.ts,.js}'],
    };
  },
};

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST ?? 'mysql',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};
