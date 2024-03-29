import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  cleanFixtures,
  getToken,
  loadFixtures,
} from '../../../../../../test/helpers';
import { AppModule } from '../../../../../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

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
  });

  describe('POST /auth/register', () => {
    it('should register user if email is not used', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullname: 'Me',
          email: 'arnaudbakyono@gmail.bf',
          password: 'agathe',
          passwordConfirmation: 'agathe',
        })
        .expect(201);

      expect(body).toMatchObject({
        id: expect.any(String),
      });
    });

    it('should fail if email is already used', async () => {
      await request(app.getHttpServer())
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

  describe('GET /auth/profile', () => {
    it('should get user profile', async () => {
      const token = getToken('2000', 'arnaudbakyono@gmail.com');

      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body).toMatchObject({
        id: 2000,
        fullname: 'Arnaud GMAIL',
        email: 'arnaud@gmail.com',
        createdAt: expect.any(String),
      });
    });
  });

  afterAll(async () => await app.close());
});
