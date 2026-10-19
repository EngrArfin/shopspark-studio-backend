import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { Request, Response } from 'express';
import { AppModule } from './app.module.js';

// Automatically load environment variables from .env if present
try {
  process.loadEnvFile();
} catch {
  // Ignore if .env is missing (e.g., containerized environments)
}

const server = express();
let isInitialized = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS for frontend applications
  app.enableCors();

  // Enable global validation pipe for request DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShopSpark Studio Backend API')
    .setDescription('REST API documentation and testing interface for ShopSpark Studio')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.init();
  isInitialized = true;
  return app;
}

// Local development: listen on port if not running in Vercel
if (!process.env.VERCEL) {
  const app = await bootstrap();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 Server running on: http://localhost:${port}`);
  console.log(`📑 Swagger Documentation available at: http://localhost:${port}/api/docs\n`);
}

// Vercel serverless function entrypoint
export default async function handler(req: Request, res: Response) {
  if (!isInitialized) {
    await bootstrap();
  }
  server(req, res);
}
