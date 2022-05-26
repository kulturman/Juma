import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
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
