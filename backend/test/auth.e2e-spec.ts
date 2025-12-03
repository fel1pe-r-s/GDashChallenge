import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key === 'MONGO_URI') return uri;
          if (key === 'JWT_SECRET') return 'test_secret';
          return null;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('/users (POST) - Create User', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'e2e@example.com', password: 'password' })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toBe('e2e@example.com');
        expect(res.body.password).toBeUndefined(); // Should not return password
      });
  });

  it('/users (POST) - Fail on duplicate user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'e2e@example.com', password: 'password' })
      .expect(400);
  });

  it('/auth/login (POST) - Login and get Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'e2e@example.com', password: 'password' })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
  });

  it('/users (GET) - Protected Route', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'e2e@example.com', password: 'password' });
    
    const token = loginRes.body.access_token;

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
