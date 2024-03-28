import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Data Validation Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should reject registration with duplicate email', async () => {
    const userData = {
      name: 'Dinis',
      surname: 'Ivanov',
      email: 'test@test.com',
      password: 'Password123',
    };

    await request(app.getHttpServer())
      .post('/user/register')
      .send(userData)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(
          'Пользователь с таким email уже существует',
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
