import { GenericContainer, StartedTestContainer } from 'testcontainers';

let mysqlContainer: StartedTestContainer;
let redisContainer: StartedTestContainer;

beforeAll(async () => {
  jest.setTimeout(60000);
  mysqlContainer = await new GenericContainer('mariadb')
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: 'juma',
      MYSQL_DATABASE: 'jumatest',
      MYSQL_USER: 'root',
      MYSQL_PASSWORD: 'juma',
    })
    .withExposedPorts(3306)
    .start();

  redisContainer = await new GenericContainer('redis')
    .withExposedPorts(6379)
    .start();

  process.env.DB_HOST = mysqlContainer.getHost();
  process.env.DB_PORT = mysqlContainer.getMappedPort(3306).toString();
  process.env.MYSQL_ROOT_PASSWORD = 'juma';
  process.env.MYSQL_DATABASE = 'jumatest';
  process.env.MYSQL_USER = 'root';
  process.env.MYSQL_PASSWORD = 'juma';
  process.env.REDIS_HOST = redisContainer.getHost();
  process.env.REDIS_PORT = redisContainer.getMappedPort(6379).toString();
});

afterAll(async () => {
  if (mysqlContainer) {
    await mysqlContainer.stop();
  }
  if (redisContainer) {
    await redisContainer.stop();
  }
});
