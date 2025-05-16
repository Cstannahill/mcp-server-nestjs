// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('MCP Server API')
    .setDescription('API documentation for the NestJS MCP Server')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

void bootstrap();
