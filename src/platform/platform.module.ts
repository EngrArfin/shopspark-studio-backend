import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service.js';
import { QuotesController } from './quotes.controller.js';
import { PaymentController } from './payment.controller.js';
import { PartyGenerationController } from './party-generation.controller.js';
import { TasksController } from './tasks.controller.js';
import { WishlistController } from './wishlist.controller.js';
import { ProviderPlanController } from './provider-plan.controller.js';
import { InvitationsController } from './invitations.controller.js';

@Module({
  controllers: [
    QuotesController,
    PaymentController,
    PartyGenerationController,
    TasksController,
    WishlistController,
    ProviderPlanController,
    InvitationsController,
  ],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}

