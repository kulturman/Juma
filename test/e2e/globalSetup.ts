import { MariaDbContainer } from '@testcontainers/mariadb';
import { RedisContainer } from '@testcontainers/redis';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import * as path from 'path';
import { register } from 'ts-node';
import { DataSource } from 'typeorm';

// Starts throwaway MariaDB and Redis containers for the e2e suite.
// Connection details are exposed through process.env, which Jest workers inherit.
export default async () => {
  const [mariadb, redis] = await Promise.all([
    new MariaDbContainer('mariadb:11.4').withDatabase('jumatest').start(),
    new RedisContainer('redis:7-alpine').start(),
  ]);

  process.env.MYSQL_HOST = mariadb.getHost();
  process.env.MYSQL_PORT = String(mariadb.getPort());
  process.env.MYSQL_DATABASE = mariadb.getDatabase();
  process.env.MYSQL_USER = mariadb.getUsername();
  process.env.MYSQL_PASSWORD = mariadb.getUserPassword();
  process.env.REDIS_HOST = redis.getHost();
  process.env.REDIS_PORT = String(redis.getPort());
  process.env.TORRENTS_STORAGE_PATH = mkdtempSync(
    path.join(tmpdir(), 'juma-e2e-'),
  );

  globalThis.__E2E_CONTAINERS__ = [mariadb, redis];

  // TypeORM requires the .ts migration files at runtime
  register({ transpileOnly: true });
  const dataSource = new DataSource({
    type: 'mysql',
    host: mariadb.getHost(),
    port: mariadb.getPort(),
    database: mariadb.getDatabase(),
    username: mariadb.getUsername(),
    password: mariadb.getUserPassword(),
    migrations: [
      path.resolve(
        __dirname,
        '../../src/sharedKernel/adapters/primary/migrations/*.ts',
      ),
    ],
  });
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
};
