import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('Weather System (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let authToken: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
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

    // Create user and get token
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'weather@test.com', password: 'password' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'weather@test.com', password: 'password' });
    
    authToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('/weather/logs (POST) - Create Log (Public/Worker)', () => {
    return request(app.getHttpServer())
      .post('/weather/logs')
      .send({
        city: 'Test City',
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        condition: 'Sunny',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.city).toBe('Test City');
      });
  });

  it('/weather/logs (GET) - Protected Route', () => {
    return request(app.getHttpServer())
      .get('/weather/logs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/weather/insights (GET) - Protected Route', () => {
    return request(app.getHttpServer())
      .get('/weather/insights')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.insight).toBeDefined();
      });
  });

  it('/weather/logs (GET) - Fail without Token', () => {
    return request(app.getHttpServer())
      .get('/weather/logs')
      .expect(401);
  });
});
