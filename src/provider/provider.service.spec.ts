import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderService } from './provider.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductStatus } from './dto/product.dto.js';
import { OrderStatus } from './dto/order.dto.js';

describe('ProviderService', () => {
  let service: ProviderService;
  let mockPrisma: PrismaService;

  beforeEach(() => {
    mockPrisma = {} as unknown as PrismaService;
    service = new ProviderService(mockPrisma);
  });

  describe('Dashboard Analytics', () => {
    it('should return valid dashboard statistics and metrics', async () => {
      const stats = await service.getDashboardStats();

      expect(stats).toBeDefined();
      expect(stats.metrics.totalRevenue).toBeGreaterThan(0);
      expect(stats.metrics.totalOrders).toBeGreaterThan(0);
      expect(stats.metrics.totalProducts).toBeGreaterThan(0);
      expect(Array.isArray(stats.salesAnalytics)).toBe(true);
      expect(stats.salesAnalytics.length).toBeGreaterThan(0);
      expect(Array.isArray(stats.topProducts)).toBe(true);
      expect(Array.isArray(stats.recentOrders)).toBe(true);
    });
  });

  describe('Provider Profile', () => {
    it('should return default provider profile', async () => {
      const profile = await service.getProfile();

      expect(profile).toBeDefined();
      expect(profile.storeName).toBe('Apex Tech Innovations');
      expect(profile.isVerified).toBe(true);
    });

    it('should update provider profile', async () => {
      const updated = await service.updateProfile({
        storeName: 'ShopNow Official Store',
        description: 'New updated official store description',
      });

      expect(updated.storeName).toBe('ShopNow Official Store');
      expect(updated.storeSlug).toBe('shopnow-official-store');
      expect(updated.description).toBe('New updated official store description');
    });
  });

  describe('Products Management', () => {
    it('should retrieve list of products with pagination', async () => {
      const result = await service.getProducts({ page: 1, limit: 5 });

      expect(result.data.length).toBeLessThanOrEqual(5);
      expect(result.total).toBeGreaterThan(0);
      expect(result.page).toBe(1);
    });

    it('should create and retrieve a new product', async () => {
      const newProd = await service.createProduct({
        title: 'Wireless Ergonomic Vertical Mouse',
        description: 'Ergonomic mouse with silent click switches and rechargeable battery.',
        price: 39.99,
        stockQuantity: 50,
        sku: 'SKU-MOUSE-VERT-01',
        category: 'Computer Peripherals',
        images: ['https://example.com/mouse.jpg'],
        tags: ['mouse', 'ergonomic'],
      });

      expect(newProd.id).toBeDefined();
      expect(newProd.title).toBe('Wireless Ergonomic Vertical Mouse');
      expect(newProd.price).toBe(39.99);

      const fetched = await service.getProductById(newProd.id);
      expect(fetched.id).toBe(newProd.id);
    });

    it('should update product status', async () => {
      const products = await service.getProducts({});
      const targetId = products.data[0]!.id;

      const updated = await service.updateProductStatus(targetId, ProductStatus.DRAFT);
      expect(updated.status).toBe(ProductStatus.DRAFT);
    });

    it('should delete a product', async () => {
      const newProd = await service.createProduct({
        title: 'Temp Item to delete',
        description: 'Temporary description',
        price: 10.0,
        stockQuantity: 5,
        sku: 'SKU-TEMP-DEL',
        category: 'General',
        images: ['https://example.com/temp.jpg'],
      });

      const deleteRes = await service.deleteProduct(newProd.id);
      expect(deleteRes.success).toBe(true);

      await expect(service.getProductById(newProd.id)).rejects.toThrow();
    });
  });

  describe('Orders Fulfillment', () => {
    it('should retrieve orders and filter by status', async () => {
      const allOrders = await service.getOrders({ status: 'ALL' });
      expect(allOrders.data.length).toBeGreaterThan(0);

      const processingOrders = await service.getOrders({ status: 'PROCESSING' });
      expect(processingOrders.data.every((o) => o.status === 'PROCESSING')).toBe(true);
    });

    it('should update order fulfillment status and add tracking info', async () => {
      const allOrders = await service.getOrders({});
      const targetId = allOrders.data[0]!.id;

      const updated = await service.updateOrderStatus(targetId, {
        status: OrderStatus.SHIPPED,
        trackingNumber: 'TEST-TRACK-123456',
        carrier: 'DHL Express',
        note: 'Package handed over to DHL Express',
      });

      expect(updated.status).toBe(OrderStatus.SHIPPED);
      expect(updated.trackingNumber).toBe('TEST-TRACK-123456');
      expect(updated.carrier).toBe('DHL Express');
      expect(updated.timeline[updated.timeline.length - 1]!.note).toContain('DHL Express');
    });
  });

  describe('Payouts & Finance', () => {
    it('should return payout summary with positive balance', async () => {
      const summary = await service.getPayoutSummary();
      expect(summary.availableBalance).toBeGreaterThan(0);
      expect(summary.minimumPayoutAmount).toBe(50.0);
    });

    it('should process a valid payout request', async () => {
      const requestRes = await service.requestPayout({
        amount: 100.0,
        paymentMethod: 'BKASH',
        accountDetails: '+8801711223344 (Personal)',
        note: 'Weekly developer earnings test',
      });

      expect(requestRes.success).toBe(true);
      expect(requestRes.payout.amount).toBe(100.0);
      expect(requestRes.payout.status).toBe('PENDING');
      expect(requestRes.payout.paymentMethod).toBe('BKASH');
    });

    it('should reject payout request exceeding available balance', async () => {
      await expect(
        service.requestPayout({
          amount: 9999999.0,
          paymentMethod: 'BANK_TRANSFER',
          accountDetails: 'Test Account',
        }),
      ).rejects.toThrow(/exceeds your available cleared balance/);
    });
  });

  describe('Reviews & Ratings', () => {
    it('should retrieve reviews and reply to a review', async () => {
      const reviewsRes = await service.getReviews({});
      expect(reviewsRes.data.length).toBeGreaterThan(0);

      const targetId = reviewsRes.data[0]!.id;
      const replyRes = await service.replyReview(targetId, {
        reply: 'Thank you for your valuable feedback!',
      });

      expect(replyRes.success).toBe(true);
      expect(replyRes.review.providerReply).toBe('Thank you for your valuable feedback!');
      expect(replyRes.review.repliedAt).toBeDefined();
    });
  });
});
