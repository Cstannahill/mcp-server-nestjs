// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      forbidUnknownValues: true, // Prevent unknown values (security best practice)
    }),
  );

  await app.listen(3000);
}

void bootstrap();
