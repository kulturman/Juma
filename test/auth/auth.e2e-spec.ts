import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { cleanFixtures, loadFixtures } from '../helpers';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await loadFixtures();
  });

  afterEach(async () => {
    await cleanFixtures();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
  });

  describe('GET /auth/login', () => {
    it('Should authenticate successfully', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'arnaudbakyono@gmail.com',
          password: 'agathe',
        })
        .expect(200);

      expect(body).toMatchObject({
        token: expect.any(String),
      });
    });

    it('Should reject authentication', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@email.com', password: 'fake' })
        .expect(401);
    });
  });

  describe('POST /auth/register', () => {
    it('Should register user if email is not used', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullname: 'Me',
          email: 'arnaudbakyono@gmail.gz',
          password: 'agathe',
          passwordConfirmation: 'agathe',
        })
        .expect(201);

      expect(body).toMatchObject({
        id: expect.any(String),
      });
    });

    it('Should fail if email is already used', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullname: 'Me',
          email: 'arnaudbakyono@gmail.com',
          password: 'agathe',
          passwordConfirmation: 'agathe',
        })
        .expect(400);
    });
  });

  afterAll(async () => await app.close());
});
