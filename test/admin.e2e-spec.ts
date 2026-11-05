import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('Admin Dashboard API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Dashboard Overview & Statistics', () => {
    it('GET /admin should return KPI overview cards, trends, and recent orders', async () => {
      const res = await request(app.getHttpServer()).get('/admin').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(1420);
      expect(res.body.data.totalProducts).toBeGreaterThanOrEqual(68);
      expect(res.body.data.totalProviders).toBeGreaterThanOrEqual(186);
      expect(res.body.data.totalRevenue).toBeGreaterThanOrEqual(42850);
      expect(res.body.data.monthlyRevenue).toBeInstanceOf(Array);
      expect(res.body.data.recentOrders).toBeInstanceOf(Array);
    });

    it('GET /stats should return high-level platform stats', async () => {
      const res = await request(app.getHttpServer()).get('/stats').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalUsers).toBeDefined();
      expect(res.body.data.totalPartyPlans).toBeDefined();
    });
  });

  describe('2. User Management', () => {
    it('GET /user should return user directory', async () => {
      const res = await request(app.getHttpServer()).get('/user').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /user/usr-1 should return single user details', async () => {
      const res = await request(app.getHttpServer()).get('/user/usr-1').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('contact@royalpartydecor.fr');
    });

    it('POST /user should create a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send({
          name: 'Test New User',
          email: 'testnew@example.com',
          role: 'USER',
        })
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('testnew@example.com');
    });
  });

  describe('3. Orders Management', () => {
    it('GET /orders should return paginated orders', async () => {
      const res = await request(app.getHttpServer()).get('/orders?page=1&limit=5').expect(200);
      expect(res.body.meta).toBeDefined();
      expect(res.body.data.orders).toBeInstanceOf(Array);
    });

    it('GET /orders/ord-101 should return order details', async () => {
      const res = await request(app.getHttpServer()).get('/orders/ord-101').expect(200);
      expect(res.body.id).toBe('ord-101');
      expect(res.body.orderNumber).toBe('ORD-2026-9841');
      expect(res.body.items).toBeInstanceOf(Array);
    });

    it('PATCH /orders/ord-101/status should update order status', async () => {
      const res = await request(app.getHttpServer())
        .patch('/orders/ord-101/status')
        .send({ status: 'DELIVERED' })
        .expect(200);
      expect(res.body.status).toBe('DELIVERED');
    });
  });

  describe('4. Custom Orders Management', () => {
    it('GET /custom-orders should return custom bespoke orders', async () => {
      const res = await request(app.getHttpServer()).get('/custom-orders').expect(200);
      expect(res.body.meta).toBeDefined();
      expect(res.body.data.orders).toBeInstanceOf(Array);
    });

    it('PATCH /custom-orders/co-1/status should update custom order status', async () => {
      const res = await request(app.getHttpServer())
        .patch('/custom-orders/co-1/status')
        .send({ status: 'IN_PRODUCTION' })
        .expect(200);
      expect(res.body.status).toBe('IN_PRODUCTION');
    });
  });

  describe('5. Provider Management', () => {
    it('GET /user/providers should return provider vendors', async () => {
      const res = await request(app.getHttpServer()).get('/user/providers').expect(200);
      expect(res.body.meta).toBeDefined();
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('PATCH /user/provider-requests/prv-3/approve should approve provider', async () => {
      const res = await request(app.getHttpServer())
        .patch('/user/provider-requests/prv-3/approve')
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isApproved).toBe(true);
      expect(res.body.data.status).toBe('ACTIVE');
    });
  });

  describe('6. Products & DIY Activities', () => {
    it('GET /products should return DIY Boxes & Gifts', async () => {
      const res = await request(app.getHttpServer()).get('/products').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.diyBoxes).toBeInstanceOf(Array);
      expect(res.body.data.gifts).toBeInstanceOf(Array);
    });

    it('GET /products/activity should return DIY activities', async () => {
      const res = await request(app.getHttpServer()).get('/products/activity').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('POST /products/create-activity should add a new DIY activity', async () => {
      const res = await request(app.getHttpServer())
        .post('/products/create-activity')
        .send({
          title: 'Glitter Clay Sculpture Craft',
          description: 'Fun modeling clay workshop for kids.',
          instructionSheet: 'Mold clay into figures and bake or dry.',
          ageRange: '5 - 10 Years',
        })
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Glitter Clay Sculpture Craft');
    });
  });

  describe('7. Blogs Management', () => {
    it('GET /blog should return blogs list', async () => {
      const res = await request(app.getHttpServer()).get('/blog').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('POST /blog should create a new blog article', async () => {
      const res = await request(app.getHttpServer())
        .post('/blog')
        .send({
          title: 'Top Balloon Styling Trends for 2026',
          description: 'Everything you need to know about organic balloon arches.',
          conclusion: 'Vibrant balloons bring vibrant energy!',
          badge: 'Decor Guide',
          tag: ['Balloons', 'Decor'],
        })
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Top Balloon Styling Trends for 2026');
    });
  });

  describe('8. Affiliated Products, Newsletter, Contact & Reviews', () => {
    it('GET /affiliated-products should return affiliate catalog', async () => {
      const res = await request(app.getHttpServer()).get('/affiliated-products').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('GET /newsletter should return subscribers', async () => {
      const res = await request(app.getHttpServer()).get('/newsletter').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('POST /newsletter should subscribe an email', async () => {
      const res = await request(app.getHttpServer())
        .post('/newsletter')
        .send({ email: 'newsubscriber@test.com' })
        .expect(201);
      expect(res.body.success).toBe(true);
    });

    it('GET /contact should return contact inquiries', async () => {
      const res = await request(app.getHttpServer()).get('/contact').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('GET /reviews should return reviews & testimonials', async () => {
      const res = await request(app.getHttpServer()).get('/reviews').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('GET /admin/settings should return system defaults', async () => {
      const res = await request(app.getHttpServer()).get('/admin/settings').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.currency).toBe('EUR (€)');
    });

    it('GET /admin/audit-logs should return compliance events', async () => {
      const res = await request(app.getHttpServer()).get('/admin/audit-logs').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });
});

