import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { BadRequestExceptionFilter } from './helpers/validation/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new BadRequestExceptionFilter());
  await app.listen(5000);
}
bootstrap();
