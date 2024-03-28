import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Auth Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const uniqueEmail = `test${Date.now()}@test.com`;

  it('POST /user/register - Success', async () => {
    await request(app.getHttpServer())
      .post('/user/register')
      .send({
        name: 'Dinis',
        surname: 'Ivanov',
        email: uniqueEmail,
        password: 'Password123',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Dinis',
            email: uniqueEmail,
            gender: 'Не указан',
            photo: null,
            registrationDate: expect.any(String),
            surname: expect.any(String),
          }),
        );
      });
  });

  it('POST /user/login - Success', async () => {
    await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: uniqueEmail,
        password: 'Password123',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            access_token: expect.any(String),
          }),
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
