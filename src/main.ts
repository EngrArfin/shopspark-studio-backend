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

// Seamless URL rewrite middleware: Allows frontend using baseURL with '/api' (e.g. /api/admin)
// or without '/api' (e.g. /admin) to reach the same controllers seamlessly, while keeping /api/docs intact.
server.use((req, res, next) => {
  if (req.url.startsWith('/api/') && !req.url.startsWith('/api/docs')) {
    req.url = req.url.substring(4); // removes leading '/api'
  }
  next();
});

const CUSTOM_SWAGGER_CSS = `
  .swagger-ui .topbar { background-color: #111827; border-bottom: 2px solid #F97316; }
  .swagger-ui .topbar .topbar-wrapper a { font-weight: 700; color: #FFFFFF; font-family: system-ui, sans-serif; }
  .swagger-ui .info { margin: 24px 0; }
  .swagger-ui .info .title { font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
  .swagger-ui .opblock.opblock-get { border-color: #3B82F6; background: rgba(59, 130, 246, 0.05); }
  .swagger-ui .opblock.opblock-post { border-color: #10B981; background: rgba(16, 185, 129, 0.05); }
  .swagger-ui .opblock.opblock-patch { border-color: #F59E0B; background: rgba(245, 158, 11, 0.05); }
  .swagger-ui .opblock.opblock-delete { border-color: #EF4444; background: rgba(239, 68, 68, 0.05); }
  .swagger-ui .btn.authorize { background-color: #F97316; border-color: #EA580C; color: #FFFFFF; }
  .swagger-ui .btn.authorize svg { fill: #FFFFFF; }
  .swagger-ui .opblock-tag { font-size: 18px; font-weight: 700; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; color: #1F2937; }
  .swagger-ui section.models { border-radius: 8px; border: 1px solid #E5E7EB; }
`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS for frontend applications
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

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
    .setTitle('ShopSpark Studio - Enterprise Backend & Admin API')
    .setDescription(
      'Professional RESTful API documentation and interactive testing interface for ShopSpark Studio. Covers complete business services across Admin Dashboard, Vendor Portal, Party Planning, Custom Orders, Catalogs, Bookings, Checkout, Tasks, and Customer Management.',
    )
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
    // Core Platform Modules
    .addTag('Admin Dashboard', 'KPI overview cards, revenue growth trends, monthly charts, system defaults & audit logs')
    .addTag('Admin User Management', 'User directory, role assignments (USER, ADMIN, PROVIDER), and customer account management')
    .addTag('Admin Orders', 'Standard order fulfillment, checkout order placement, shipping addresses, tracking, and statuses')
    .addTag('Admin Custom Orders', 'Custom t-shirt & bespoke merchandise orders, printing notes, artwork mockups, and status updates')
    .addTag('Admin Provider Management', 'Vendor directory, onboarding applications, approval/rejection workflows, and verified badges')
    .addTag('Admin Products', 'Catalog CRUD for DIY boxes and gift collections with pricing, age ranges, and included kits')
    .addTag('Admin DIY Activities', 'Interactive DIY craft guides, step-by-step instruction sheets, video tutorials, and PDFs')
    .addTag('Admin Blogs', 'Platform blog articles, party planning advice, parent guides, tags, and cover images')
    .addTag('Admin Affiliated Products', 'Curated partner accessories, affiliate links, pricing, and external redirects')
    .addTag('Admin Newsletter', 'Email subscriber management and promotional campaign broadcasts')
    .addTag('Admin Contact Inquiries', 'Customer support messages, bulk booking questions, and inquiry resolution status')
    .addTag('Admin Reviews & Testimonials', 'Parent reviews, provider testimonials, star ratings, and moderation')
    // Customer & Provider Platform Services
    .addTag('Authentication', 'User, Admin, and Provider registration, JWT authentication, and password reset flows')
    .addTag('Provider Dashboard', 'Seller store metrics, product inventory, order processing, and payout withdrawals')
    .addTag('Quotes & Event Bookings', 'Event quote bids, customer booking reservations, and cancellation controls')
    .addTag('Stripe Provider Payment', 'Stripe Connect Express onboarding, vendor dashboard SSO, and quote payment sessions')
    .addTag('Party Planning & AI Generation', 'Automated party agendas, decoration itineraries, and gift recommendations')
    .addTag('Party Tasks & Checklist', 'Party preparation checklist, deadlines, and timeline categorizations')
    .addTag('User Wishlist & Favorites', 'Customer saved DIY craft kits, gift collections, and bookmarks')
    .addTag('Provider Subscription Plans', 'Vendor membership tiers, features matrix, and pricing management')
    .addTag('Party Invitations & RSVP', 'Digital party invitation cards, guest email dispatches, and online RSVP tokens')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const SWAGGER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2';

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ShopSpark Studio - Professional Backend & Admin API Docs',
    customfavIcon: 'https://swagger.io/favicon.ico',
    customCss: CUSTOM_SWAGGER_CSS,
    customCssUrl: [
      `${SWAGGER_CDN}/swagger-ui.min.css`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.min.css`,
    ],
    customJs: [
      `${SWAGGER_CDN}/swagger-ui-bundle.min.js`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.min.js`,
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
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
  console.log(`\n🚀 Enterprise Server running on: http://localhost:${port}`);
  console.log(`📑 Professional Swagger API Docs available at: http://localhost:${port}/api/docs\n`);
}

// Vercel serverless function entrypoint
export default async function handler(req: Request, res: Response) {
  if (!isInitialized) {
    await bootstrap();
  }
  server(req, res);
}
