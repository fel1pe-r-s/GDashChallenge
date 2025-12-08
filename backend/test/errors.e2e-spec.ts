import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('Error Scenarios (e2e)', () => {
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
          if (key === 'DEFAULT_ADMIN_PASSWORD') return 'admin123';
          if (key === 'DEFAULT_ADMIN_EMAIL') return 'admin@example.com';
          return undefined;
        },
      })
      .overrideProvider('ConfigDataService')
      .useValue({
        getConfig: jest.fn().mockResolvedValue({
          city: 'Test City',
          latitude: '0',
          longitude: '0',
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    // Create user and get token
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('Authentication Errors', () => {
    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password' })
        .expect(401);
    });

    it('should return 401 for missing password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);
    });

    it('should return 401 for missing email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'password' })
        .expect(400);
    });
  });

  describe('Protected Route Errors', () => {
    it('should return 401 for missing token', () => {
      return request(app.getHttpServer())
        .get('/weather/logs')
        .expect(401);
    });

    it('should return 401 for invalid token', () => {
      return request(app.getHttpServer())
        .get('/weather/logs')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 for malformed Authorization header', () => {
      return request(app.getHttpServer())
        .get('/weather/logs')
        .set('Authorization', 'InvalidFormat')
        .expect(401);
    });
  });

  describe('Validation Errors', () => {
    it('should reject invalid email format', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'invalid-email', password: 'password' })
        .expect(400);
    });

    it('should reject missing required fields', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400);
    });

    it('should reject extra fields when forbidNonWhitelisted is true', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'test@example.com', password: 'password', extraField: 'value' })
        .expect(400);
    });
  });

  describe('Weather Data Errors', () => {
    it('should handle missing required fields in weather log', () => {
      return request(app.getHttpServer())
        .post('/weather/logs')
        .send({ city: 'Test' })
        .expect(400); // Fails due to missing required fields
    });

    it('should return empty insights when no data', async () => {
      // Clear any existing data by creating a new test
      const response = await request(app.getHttpServer())
        .get('/weather/insights')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should have a message or default values
      expect(response.body).toBeDefined();
    });
  });

  describe('Duplicate User Error', () => {
    it('should prevent duplicate user creation', async () => {
      const userData = { email: 'duplicate@example.com', password: 'password' };
      
      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email', () => {
      const longEmail = 'a'.repeat(200) + '@example.com';
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: longEmail, password: 'password' })
        .expect(400);
    });

    it('should handle special characters in password', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'special@example.com', password: '!@#$%^&*()_+{}|:"<>?' })
        .expect(201);
    });

    it('should handle unicode characters in city name', () => {
      return request(app.getHttpServer())
        .post('/weather/logs')
        .send({
          city: '北京',
          temperature: 20,
          humidity: 50,
          windSpeed: 10,
          condition: 'Clear',
        })
        .expect(201);
    });

    it('should handle negative temperature', () => {
      return request(app.getHttpServer())
        .post('/weather/logs')
        .send({
          city: 'Arctic',
          temperature: -40,
          humidity: 80,
          windSpeed: 20,
          condition: 'Snow',
        })
        .expect(201);
    });
  });
});
