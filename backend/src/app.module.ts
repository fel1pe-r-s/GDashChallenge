import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { PublicApiModule } from './public-api/public-api.module';
import { ConfigDataModule } from './config-data/config-data.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    DatabaseModule,
    UsersModule,
    AuthModule,
    WeatherModule,
    PublicApiModule,
    ConfigDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
