import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { BadRequestExceptionFilter } from './sharedKernel/adapaters/primary/nest/exceptionFilters/bad-request-exception.filter';
import { CoreExceptionFilter } from './sharedKernel/adapaters/primary/nest/exceptionFilters/coreExceptionFilter';

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
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new CoreExceptionFilter(),
  );
  await app.listen(5000);
}
bootstrap();
