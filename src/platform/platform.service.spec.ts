import { describe, it, expect, beforeEach } from 'vitest';
import { PlatformService } from './platform.service.js';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    service = new PlatformService();
  });

  describe('Quotes & Bookings', () => {
    it('should create and retrieve customer quote requests', async () => {
      const created = await service.createQuote({
        providerId: 'prv-1',
        date: '2026-12-01',
        time: '15:00',
        location: 'Paris',
        guestCount: 20,
      });

      expect(created.statusCode).toBe(201);
      expect(created.data.providerId).toBe('prv-1');

      const myQuotes = await service.getMyQuotes();
      expect(myQuotes.data.data.length).toBeGreaterThan(0);

      const updated = await service.updateQuoteStatus(created.data.id, 'BOOKED');
      expect(updated.data.status).toBe('BOOKED');
    });
  });

  describe('Stripe Provider Payment', () => {
    it('should generate checkout payment URL and onboarding link', async () => {
      const checkout = await service.checkoutPayment('quote-101');
      expect(checkout.data.url).toContain('checkout.stripe.com');

      const onboarding = await service.getOnboardingLink();
      expect(onboarding.data.url).toContain('connect.stripe.com');

      const status = await service.getOnboardingStatus();
      expect(status.data.charges_enabled).toBe(true);
    });
  });

  describe('Party Planning & AI Generation', () => {
    it('should save party plans and track generation metric', async () => {
      const saved = await service.savePartyPlan({
        title: 'Maya 5th Princess Party',
        scheduledDate: '2026-12-15',
        sections: [],
        timelineEvents: [],
      });

      expect(saved.statusCode).toBe(201);
      expect(saved.data.title).toBe('Maya 5th Princess Party');

      const track = await service.trackGeneration();
      expect(track.totalGenerations).toBeGreaterThan(340);
    });
  });

  describe('Tasks Checklist', () => {
    it('should perform CRUD on party planning tasks', async () => {
      const tasks = await service.getTasks();
      expect(tasks.data.length).toBeGreaterThan(0);

      const created = await service.createTask({
        name: 'Pick up balloons',
        category: 'Decor',
        priority: 'HIGH',
        dueDate: '2026-11-20',
      });
      expect(created.statusCode).toBe(201);

      const updated = await service.updateTask(created.data.id, { isComplete: true });
      expect(updated.data.isComplete).toBe(true);

      const deleted = await service.deleteTask(created.data.id);
      expect(deleted.statusCode).toBe(200);
    });
  });

  describe('Wishlist / Favorites', () => {
    it('should manage favorite products', async () => {
      const list = await service.getWishlist();
      expect(list.data.length).toBeGreaterThan(0);

      const added = await service.addToWishlist('prod-002');
      expect(added.statusCode).toBe(201);
      expect(added.data.prodcut.id).toBe('prod-002');

      const removed = await service.removeFromWishlist(added.data.id);
      expect(removed.statusCode).toBe(200);
    });
  });

  describe('Provider Membership Plans', () => {
    it('should retrieve and manage vendor tiers', async () => {
      const plans = await service.getProviderPlans();
      expect(plans.data.length).toBe(2);

      const created = await service.createProviderPlan({
        name: 'Elite Vendor VIP',
        price: 99.0,
        interval: 'MONTHLY',
        description: 'Elite plan for enterprise agencies',
        features: ['Dedicated Account Manager', '24/7 Phone Support'],
      });
      expect(created.statusCode).toBe(201);
      expect(created.data.name).toBe('Elite Vendor VIP');
    });
  });

  describe('Digital Invitations & RSVP', () => {
    it('should dispatch invitations and process RSVP tokens', async () => {
      const inv = await service.sendInvitation({
        email: 'guest@example.com',
        guest_name: 'Camille',
        party_id: 'plan-101',
        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
      });
      expect(inv.statusCode).toBe(201);
      expect(inv.data.status).toBe('PENDING');

      const confirmed = await service.confirmInvitation(inv.data.invitationToken);
      expect(confirmed.data.status).toBe('CONFIRMED');
    });
  });
});

