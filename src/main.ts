import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT);
}
bootstrap();
