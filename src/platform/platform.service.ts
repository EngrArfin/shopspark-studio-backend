import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteRequestDto, QuoteResponseDto } from './dto/quotes.dto.js';
import {
  PartyGenerationRequestDto,
  PartyGenerationResponseDto,
} from './dto/party-generation.dto.js';
import { CreateTaskRequestDto, TaskDto, UpdateTaskRequestDto } from './dto/tasks.dto.js';
import { WishlistItemDto } from './dto/wishlist.dto.js';
import { PlanDto, PlanFormDataDto } from './dto/provider-plan.dto.js';
import { InvitationDto, SendInvitationRequestDto } from './dto/invitations.dto.js';
import {
  INITIAL_INVITATIONS,
  INITIAL_PARTY_PLANS,
  INITIAL_PROVIDER_PLANS,
  INITIAL_QUOTES,
  INITIAL_TASKS,
  INITIAL_WISHLIST,
} from './mock-platform-data.js';

@Injectable()
export class PlatformService {
  private quotes: QuoteResponseDto[] = [...INITIAL_QUOTES];
  private partyPlans: PartyGenerationResponseDto[] = [...INITIAL_PARTY_PLANS];
  private tasks: TaskDto[] = [...INITIAL_TASKS];
  private wishlist: WishlistItemDto[] = [...INITIAL_WISHLIST];
  private providerPlans: PlanDto[] = [...INITIAL_PROVIDER_PLANS];
  private invitations: InvitationDto[] = [...INITIAL_INVITATIONS];
  private partyGenerationCounter = 342;

  // ==========================================
  // 1. QUOTES & BOOKINGS
  // ==========================================
  async createQuote(dto: QuoteRequestDto) {
    const newQuote: QuoteResponseDto = {
      id: `quote-${Date.now()}`,
      providerId: dto.providerId,
      userId: 'usr-2',
      providerName: 'Royal Party Balloons & Decor',
      totalPrice: 250,
      status: 'PENDING',
      date: dto.date,
      location: dto.location,
      createdAt: new Date().toISOString(),
    };

    this.quotes.unshift(newQuote);
    return {
      statusCode: 201,
      success: true,
      message: 'Quote request submitted to provider successfully',
      data: newQuote,
    };
  }

  async getMyQuotes(page = 1, limit = 10) {
    return {
      statusCode: 200,
      success: true,
      message: 'Quotes retrieved successfully',
      data: {
        meta: {
          total: this.quotes.length,
          page,
          limit,
          totalPages: Math.ceil(this.quotes.length / limit) || 1,
        },
        data: this.quotes,
      },
    };
  }

  async getProviderQuotes(page = 1, limit = 10) {
    return {
      statusCode: 200,
      success: true,
      message: 'Provider quotes retrieved successfully',
      data: {
        meta: {
          total: this.quotes.length,
          page,
          limit,
          totalPages: Math.ceil(this.quotes.length / limit) || 1,
        },
        data: this.quotes,
      },
    };
  }

  async updateQuoteStatus(id: string, status: 'BOOKED' | 'CANCELLED') {
    const quote = this.quotes.find((q) => q.id === id);
    if (!quote) throw new NotFoundException(`Quote '${id}' not found`);
    quote.status = status;
    return {
      statusCode: 200,
      success: true,
      message: `Quote status updated to ${status}`,
      data: quote,
    };
  }

  async cancelQuote(id: string) {
    return this.updateQuoteStatus(id, 'CANCELLED');
  }

  // ==========================================
  // 2. STRIPE PAYMENT & ONBOARDING
  // ==========================================
  async checkoutPayment(quoteId: string) {
    return {
      statusCode: 200,
      success: true,
      data: {
        url: `https://checkout.stripe.com/pay/cs_test_${quoteId}`,
      },
    };
  }

  async getOnboardingLink() {
    return {
      statusCode: 200,
      success: true,
      data: {
        url: 'https://connect.stripe.com/setup/s/acct_test_mock_123',
      },
    };
  }

  async getOnboardingStatus() {
    return {
      statusCode: 200,
      success: true,
      data: {
        charges_enabled: true,
        payouts_enabled: true,
        details_submitted: true,
      },
    };
  }

  async loginDashboard() {
    return {
      statusCode: 200,
      success: true,
      data: {
        url: 'https://dashboard.stripe.com/test_login',
      },
    };
  }

  // ==========================================
  // 3. PARTY GENERATION & PLANNING
  // ==========================================
  async savePartyPlan(dto: PartyGenerationRequestDto) {
    const newPlan: PartyGenerationResponseDto = {
      id: `plan-${Date.now()}`,
      title: dto.title,
      scheduledDate: dto.scheduledDate,
      totalInvitation: 10,
      totalInvitationConfirm: 0,
      totalPendingInvitaion: 10,
      totalInvitationCancel: 0,
      sections: dto.sections || [],
      timelineEvents: dto.timelineEvents || [],
      suggestedGifts: dto.suggestedGifts || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.partyPlans.unshift(newPlan);
    return {
      statusCode: 201,
      success: true,
      message: 'Party plan saved successfully',
      data: newPlan,
    };
  }

  async getPartyPlans() {
    return {
      statusCode: 200,
      success: true,
      data: this.partyPlans,
    };
  }

  async getPartyPlanById(id: string) {
    const plan = this.partyPlans.find((p) => p.id === id);
    if (!plan) throw new NotFoundException(`Party plan '${id}' not found`);
    return {
      statusCode: 200,
      success: true,
      data: plan,
    };
  }

  async trackGeneration() {
    this.partyGenerationCounter++;
    return {
      statusCode: 200,
      success: true,
      totalGenerations: this.partyGenerationCounter,
    };
  }

  // ==========================================
  // 4. TASKS & CHECKLIST
  // ==========================================
  async getTasks() {
    return {
      statusCode: 200,
      success: true,
      data: this.tasks,
    };
  }

  async getTasksByCategory() {
    const grouped: Record<string, TaskDto[]> = {};
    for (const t of this.tasks) {
      if (!grouped[t.category]) grouped[t.category] = [];
      grouped[t.category].push(t);
    }
    return {
      statusCode: 200,
      success: true,
      data: grouped,
    };
  }

  async getTasksTimeline() {
    return {
      statusCode: 200,
      success: true,
      data: {
        today: this.tasks.slice(0, 1),
        next2Days: this.tasks.slice(1, 2),
        thisWeek: this.tasks.slice(2),
        later: [],
      },
    };
  }

  async getTaskById(id: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task '${id}' not found`);
    return {
      statusCode: 200,
      success: true,
      data: task,
    };
  }

  async createTask(dto: CreateTaskRequestDto) {
    const newTask: TaskDto = {
      id: `task-${Date.now()}`,
      name: dto.name,
      isComplete: false,
      category: dto.category,
      priority: dto.priority,
      dueDate: dto.dueDate,
      daysAhead: 5,
      userId: 'usr-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    return {
      statusCode: 201,
      success: true,
      message: 'Task created successfully',
      data: newTask,
    };
  }

  async updateTask(id: string, dto: UpdateTaskRequestDto) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) throw new NotFoundException(`Task '${id}' not found`);

    const updated = {
      ...this.tasks[taskIndex],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[taskIndex] = updated;
    return {
      statusCode: 200,
      success: true,
      message: 'Task updated successfully',
      data: updated,
    };
  }

  async deleteTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Task '${id}' removed`,
      data: null,
    };
  }

  // ==========================================
  // 5. WISHLIST / FAVORITES
  // ==========================================
  async getWishlist() {
    return {
      statusCode: 200,
      success: true,
      data: this.wishlist,
    };
  }

  async addToWishlist(productId: string) {
    const newItem: WishlistItemDto = {
      id: `fav-${Date.now()}`,
      prodcut: {
        id: productId,
        title: 'Safari Adventure Explorer DIY Party Box',
        price: 49.99,
        discounted_price: 39.99,
        description: 'Complete DIY party craft box with animal masks and binoculars.',
        imges: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'],
      },
    };

    this.wishlist.unshift(newItem);
    return {
      statusCode: 201,
      success: true,
      message: 'Item added to favorites',
      data: newItem,
    };
  }

  async removeFromWishlist(favoriteId: string) {
    this.wishlist = this.wishlist.filter((w) => w.id !== favoriteId);
    return {
      statusCode: 200,
      success: true,
      message: `Item removed from favorites`,
    };
  }

  // ==========================================
  // 6. PROVIDER MEMBERSHIP PLANS
  // ==========================================
  async getProviderPlans() {
    return {
      statusCode: 200,
      success: true,
      data: this.providerPlans,
    };
  }

  async getProviderPlanById(id: string) {
    const plan = this.providerPlans.find((p) => p.id === id);
    if (!plan) throw new NotFoundException(`Plan '${id}' not found`);
    return {
      statusCode: 200,
      success: true,
      data: plan,
    };
  }

  async createProviderPlan(dto: PlanFormDataDto) {
    const newPlan: PlanDto = {
      id: `plan-${Date.now()}`,
      name: dto.name,
      price: dto.price,
      interval: dto.interval,
      description: dto.description,
      features: dto.features || [],
      isPopular: dto.isPopular || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.providerPlans.push(newPlan);
    return {
      statusCode: 201,
      success: true,
      message: 'Plan created successfully',
      data: newPlan,
    };
  }

  async updateProviderPlan(id: string, dto: PlanFormDataDto) {
    const index = this.providerPlans.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException(`Plan '${id}' not found`);

    const updated = {
      ...this.providerPlans[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.providerPlans[index] = updated;
    return {
      statusCode: 200,
      success: true,
      message: 'Plan updated successfully',
      data: updated,
    };
  }

  async deleteProviderPlan(id: string) {
    this.providerPlans = this.providerPlans.filter((p) => p.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Plan '${id}' deleted`,
    };
  }

  // ==========================================
  // 7. INVITATIONS
  // ==========================================
  async sendInvitation(dto: SendInvitationRequestDto) {
    const newInv: InvitationDto = {
      id: `inv-${Date.now()}`,
      status: 'PENDING',
      email: dto.email,
      guest_name: dto.guest_name,
      guest_phone: dto.guest_phone,
      party_id: dto.party_id,
      image: dto.imageUrl,
      invitationToken: `tok_inv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.invitations.unshift(newInv);
    return {
      statusCode: 201,
      success: true,
      message: 'Invitation dispatched successfully',
      data: newInv,
    };
  }

  async confirmInvitation(token: string) {
    const inv = this.invitations.find((i) => i.invitationToken === token || i.id === token);
    if (!inv) throw new NotFoundException(`Invitation token '${token}' not found`);
    inv.status = 'CONFIRMED';
    return {
      statusCode: 200,
      success: true,
      message: 'RSVP confirmed successfully',
      data: inv,
    };
  }

  async cancelInvitation(token: string) {
    const inv = this.invitations.find((i) => i.invitationToken === token || i.id === token);
    if (!inv) throw new NotFoundException(`Invitation token '${token}' not found`);
    inv.status = 'CANCELLED';
    return {
      statusCode: 200,
      success: true,
      message: 'RSVP cancelled successfully',
      data: inv,
    };
  }
}

