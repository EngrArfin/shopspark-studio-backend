import { describe, it, expect, beforeEach } from 'vitest';
import { AdminService } from './admin.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminOrderStatus } from './dto/admin-order.dto.js';

describe('AdminService', () => {
  let service: AdminService;
  let mockPrisma: PrismaService;

  beforeEach(() => {
    mockPrisma = {} as unknown as PrismaService;
    service = new AdminService(mockPrisma);
  });

  describe('1. Admin Dashboard Overview & KPIs', () => {
    it('should return overview cards, trends, and revenue analytics', async () => {
      const res = await service.getDashboardOverview();

      expect(res.statusCode).toBe(200);
      expect(res.success).toBe(true);
      expect(res.data.totalUsers).toBeGreaterThanOrEqual(1420);
      expect(res.data.totalProducts).toBeGreaterThanOrEqual(68);
      expect(res.data.totalProviders).toBeGreaterThanOrEqual(186);
      expect(res.data.totalRevenue).toBeGreaterThanOrEqual(42850);
      expect(res.data.userGrowthPercentage).toBe(10.5);
      expect(Array.isArray(res.data.monthlyRevenue)).toBe(true);
      expect(res.data.monthlyRevenue.length).toBe(6);
      expect(Array.isArray(res.data.recentOrders)).toBe(true);
      expect(Array.isArray(res.data.topProviders)).toBe(true);
    });

    it('should return platform high level statistics', async () => {
      const res = await service.getStats();

      expect(res.statusCode).toBe(200);
      expect(res.data.totalUsers).toBeGreaterThanOrEqual(1420);
      expect(res.data.totalPartyPlans).toBe(324);
      expect(res.data.totalBookings).toBe(890);
    });
  });

  describe('2. User Management', () => {
    it('should retrieve list of registered users with pagination', async () => {
      const res = await service.getAllUsers();

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.meta.total).toBeGreaterThan(0);
    });

    it('should filter users by role', async () => {
      const res = await service.getAllUsers(undefined, 'PROVIDER');

      expect(res.data.every((u) => u.role === 'PROVIDER')).toBe(true);
    });

    it('should find user by ID', async () => {
      const res = await service.getUserById('usr-1');

      expect(res.data.id).toBe('usr-1');
      expect(res.data.email).toBe('contact@royalpartydecor.fr');
    });

    it('should create and delete a user', async () => {
      const created = await service.createUser({
        name: 'Test Administrator',
        email: 'testadmin@shopspark.com',
        role: 'ADMIN',
      });

      expect(created.statusCode).toBe(201);
      expect(created.data.email).toBe('testadmin@shopspark.com');

      const deleted = await service.deleteUser(created.data.id);
      expect(deleted.statusCode).toBe(200);
    });
  });

  describe('3. Orders & Custom Orders Management', () => {
    it('should retrieve paginated orders', async () => {
      const res = await service.getOrders({ page: 1, limit: 10 });

      expect(res.meta.total).toBeGreaterThan(0);
      expect(Array.isArray(res.data.orders)).toBe(true);
      expect(res.data.orders[0].id).toBe('ord-101');
    });

    it('should update standard order fulfillment status', async () => {
      const updated = await service.updateOrderStatus('ord-101', AdminOrderStatus.DELIVERED);

      expect(updated.status).toBe(AdminOrderStatus.DELIVERED);
    });

    it('should retrieve custom merchandise orders and update status', async () => {
      const customOrders = await service.getCustomOrders({ page: 1, limit: 10 });

      expect(customOrders.data.orders.length).toBeGreaterThan(0);
      expect(customOrders.data.orders[0].tShirtType).toBe('Crew Neck Cotton');

      const updated = await service.updateCustomOrderStatus('co-1', 'IN_PRODUCTION');
      expect(updated.status).toBe('IN_PRODUCTION');
    });
  });

  describe('4. Provider Onboarding & Management', () => {
    it('should retrieve provider directory with categories', async () => {
      const res = await service.getProviders({});

      expect(res.meta.total).toBeGreaterThan(0);
      expect(res.data.some((p) => p.bussinessName.includes('Royal Party Balloons'))).toBe(true);
    });

    it('should approve pending provider application', async () => {
      const approved = await service.approveProvider('prv-3');

      expect(approved.isApproved).toBe(true);
      expect(approved.status).toBe('ACTIVE');
    });

    it('should reject provider application', async () => {
      const rejected = await service.rejectProvider('prv-3');

      expect(rejected.isApproved).toBe(false);
      expect(rejected.status).toBe('SUSPENDED');
    });
  });

  describe('5. Products & DIY Activities Management', () => {
    it('should retrieve products catalog grouped into diyBoxes and gifts', async () => {
      const res = await service.getProducts();

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.data.diyBoxes)).toBe(true);
      expect(Array.isArray(res.data.gifts)).toBe(true);
    });

    it('should create and update a new product item', async () => {
      const created = await service.createProduct({
        title: 'New Galactic Craft Box',
        description: 'Complete space-themed craft kit.',
        product_type: 'DIY_BOX',
        theme: 'Space',
        category: 'DIY Boxes',
        age_range: '6 - 12 Years',
        price: 39.99,
        included: ['Stickers', 'Glow Paint'],
      });

      expect(created.statusCode).toBe(201);
      expect(created.data.title).toBe('New Galactic Craft Box');

      const updated = await service.updateProduct(created.data.id, {
        price: 34.99,
      });

      expect(updated.data.price).toBe(34.99);
    });

    it('should retrieve DIY activities and support creation', async () => {
      const activities = await service.getActivities();

      expect(activities.data.length).toBeGreaterThan(0);

      const created = await service.createActivity({
        title: '3D Paper Dragon Craft',
        description: 'Fold dynamic dragon wings and horns.',
        instructionSheet: 'Fold along dashed lines and glue wings.',
        ageRange: '8 - 14 Years',
      });

      expect(created.data.title).toBe('3D Paper Dragon Craft');
    });
  });

  describe('6. Blogs, Affiliated Products, Newsletter, Contact & Reviews', () => {
    it('should retrieve blogs and create a new article', async () => {
      const blogs = await service.getBlogs();
      expect(blogs.data.length).toBeGreaterThan(0);

      const created = await service.createBlog({
        title: 'Creative Balloon Twisting 101',
        description: 'Beginner balloon twisting techniques for home parties.',
        conclusion: 'Have fun and keep practicing!',
        badge: 'Craft Tip',
        tag: ['Balloons', 'Tutorial'],
      });

      expect(created.data.title).toBe('Creative Balloon Twisting 101');
    });

    it('should retrieve and manage affiliated products', async () => {
      const aff = await service.getAffiliatedProducts();
      expect(aff.data.length).toBeGreaterThan(0);
      expect(aff.data[0].productLink).toContain('amazon.com');
    });

    it('should manage newsletter subscriptions and campaigns', async () => {
      const subs = await service.getNewsletterSubscribers();
      expect(subs.data.length).toBeGreaterThan(0);

      const newSub = await service.createNewsletterSubscriber({
        email: 'tester@shopsparkstudio.com',
      });
      expect(newSub.statusCode).toBe(201);

      const campaign = await service.sendNewsletterCampaign({
        subject: 'Weekend Flash Sale!',
        content: 'Enjoy 15% off all DIY kits.',
      });
      expect(campaign.statusCode).toBe(200);
      expect(campaign.dispatchedCount).toBeGreaterThan(0);
    });

    it('should manage contact inquiries and resolutions', async () => {
      const messages = await service.getContactMessages();
      expect(messages.data.length).toBeGreaterThan(0);

      const updated = await service.updateContactStatus('ct-1', 'RESOLVED');
      expect(updated.status).toBe('RESOLVED');
    });

    it('should manage customer reviews and testimonials', async () => {
      const reviews = await service.getReviews();
      expect(reviews.data.length).toBeGreaterThan(0);

      const created = await service.createReview({
        name: 'Marie Curie',
        review: 'Superb educational fun for the children.',
        rating: 5,
        type: 'Happy Parents',
      });
      expect(created.statusCode).toBe(201);
      expect(created.data.name).toBe('Marie Curie');
    });

    it('should get and update system default settings and log audit events', async () => {
      const settings = await service.getSettings();
      expect(settings.data.currency).toBe('EUR (€)');

      const updated = await service.updateSettings({
        platformFeePercentage: 12.5,
      });
      expect(updated.data.platformFeePercentage).toBe(12.5);

      const auditLogs = await service.getAuditLogs();
      expect(auditLogs.data.length).toBeGreaterThan(0);
      expect(auditLogs.data[0].action).toContain('Updated system settings');
    });
  });
});

