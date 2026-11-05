import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { OrdersController } from './orders.controller.js';
import { AdminProvidersController } from './admin-providers.controller.js';
import { ProductsController } from './products.controller.js';
import { BlogController } from './blog.controller.js';
import { AffiliatedProductsController } from './affiliated-products.controller.js';
import { NewsletterController } from './newsletter.controller.js';
import { ContactController } from './contact.controller.js';
import { ReviewsController } from './reviews.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminController,
    OrdersController,
    AdminProvidersController,
    ProductsController,
    BlogController,
    AffiliatedProductsController,
    NewsletterController,
    ContactController,
    ReviewsController,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

