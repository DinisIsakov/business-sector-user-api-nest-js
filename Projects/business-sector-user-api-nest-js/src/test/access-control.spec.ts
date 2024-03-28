import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Access Control Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should return 404 when trying to access a non-existing user's profile", async () => {
    const nonExistingUserId = 9999;
    await request(app.getHttpServer())
      .get(`/profile/${nonExistingUserId}`)
      .expect(404)
      .then((response) => {
        expect(response.text).toContain('Cannot GET /profile/9999');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
