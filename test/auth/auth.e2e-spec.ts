import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { cleanFixtures, loadFixtures } from '../../src/helpers/fixtures';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await loadFixtures();
  })

  afterEach(async () => {
    await cleanFixtures();
  })

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /auth/login', () => {
    it('Should authenticate successfully', async () => {
      const { body: data } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          'email': 'arnaudbakyono@gmail.com',
          'password': 'agathe'
        })
        .expect(200);
  
      expect(data).toMatchObject({
        token: expect.any(String)
      })
  
    });
  
    it('Should reject authentication', async () => {
      return request(app.getHttpServer())
             .post('/auth/login')
             .send({ email: 'nonexistent@email.com' , password: 'fake'})
             .expect(401)
    })
  })

  afterAll(async () => await app.close());
});
