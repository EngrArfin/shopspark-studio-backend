import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  AdminDashboardOverviewDto,
  AdminOverviewResponseDto,
  AdminStatsResponseDto,
  StateDataDto,
} from './dto/admin-dashboard-stats.dto.js';
import {
  AdminOrderDto,
  AdminOrderQueryDto,
  AdminOrderStatus,
  AdminPaymentStatus,
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  PaginatedAdminOrdersResponseDto,
} from './dto/admin-order.dto.js';
import {
  CreateCustomOrderRequestDto,
  CreateCustomOrderResponseDto,
  CustomOrderItemDto,
  CustomOrderQueryDto,
  PaginatedCustomOrdersResponseDto,
} from './dto/admin-custom-order.dto.js';
import {
  AdminProviderItemDto,
  AdminProviderQueryDto,
  PaginatedAdminProvidersResponseDto,
} from './dto/admin-provider.dto.js';
import {
  AdminProductItemDto,
  CreateAdminProductDto,
  ProductsApiResponseDto,
  SingleProductApiResponseDto,
  UpdateAdminProductDto,
} from './dto/admin-product.dto.js';
import {
  AdminDiyActivityDto,
  CreateAdminDiyActivityDto,
  DiyActivityResponseDto,
  SingleDiyActivityResponseDto,
  UpdateAdminDiyActivityDto,
} from './dto/admin-activity.dto.js';
import {
  AdminBlogDto,
  BlogsApiResponseDto,
  CreateAdminBlogDto,
  SingleBlogApiResponseDto,
  UpdateAdminBlogDto,
} from './dto/admin-blog.dto.js';
import {
  AdminAffiliatedProductDto,
  AffiliatedProductsResponseDto,
  CreateAffiliatedProductDto,
  SingleAffiliatedProductResponseDto,
  UpdateAffiliatedProductDto,
} from './dto/admin-affiliated-product.dto.js';
import {
  CreateNewsletterSubscriberDto,
  NewsletterResponseDto,
  NewsletterSubscriberDto,
  SendNewsletterCampaignDto,
} from './dto/admin-newsletter.dto.js';
import {
  ContactMessageDto,
  ContactResponseDto,
  CreateContactMessageDto,
} from './dto/admin-contact.dto.js';
import {
  AdminReviewDto,
  CreateAdminReviewDto,
  ReviewsResponseDto,
  UpdateAdminReviewDto,
} from './dto/admin-review.dto.js';
import {
  AuditLogItemDto,
  AuditLogsResponseDto,
  SystemDefaultsDto,
  SystemSettingsResponseDto,
  UpdateSystemDefaultsDto,
} from './dto/admin-settings.dto.js';
import {
  INITIAL_ADMIN_BLOGS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_PROVIDERS,
  INITIAL_ADMIN_REVIEWS,
  INITIAL_ADMIN_USERS,
  INITIAL_AFFILIATED_PRODUCTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONTACT_MESSAGES,
  INITIAL_CUSTOM_ORDERS,
  INITIAL_DIY_ACTIVITIES,
  INITIAL_NEWSLETTER_SUBSCRIBERS,
  INITIAL_SYSTEM_DEFAULTS,
} from './mock-admin-data.js';

@Injectable()
export class AdminService {
  // In-memory data collections matching frontend needs
  private users = [...INITIAL_ADMIN_USERS];
  private orders: AdminOrderDto[] = [...INITIAL_ADMIN_ORDERS];
  private customOrders: CustomOrderItemDto[] = [...INITIAL_CUSTOM_ORDERS];
  private providers: AdminProviderItemDto[] = [...INITIAL_ADMIN_PROVIDERS];
  private products: AdminProductItemDto[] = [...INITIAL_ADMIN_PRODUCTS];
  private activities: AdminDiyActivityDto[] = [...INITIAL_DIY_ACTIVITIES];
  private blogs: AdminBlogDto[] = [...INITIAL_ADMIN_BLOGS];
  private affiliatedProducts: AdminAffiliatedProductDto[] = [...INITIAL_AFFILIATED_PRODUCTS];
  private subscribers: NewsletterSubscriberDto[] = [...INITIAL_NEWSLETTER_SUBSCRIBERS];
  private contactMessages: ContactMessageDto[] = [...INITIAL_CONTACT_MESSAGES];
  private reviews: AdminReviewDto[] = [...INITIAL_ADMIN_REVIEWS];
  private auditLogs: AuditLogItemDto[] = [...INITIAL_AUDIT_LOGS];
  private systemDefaults: SystemDefaultsDto = { ...INITIAL_SYSTEM_DEFAULTS };

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // 1. ADMIN DASHBOARD OVERVIEW & STATS
  // ==========================================
  async getDashboardOverview(): Promise<AdminOverviewResponseDto> {
    const totalUsers = this.users.length;
    const totalProducts = this.products.length;
    const totalProviders = this.providers.filter((p) => p.isApproved).length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const orderStatusCounts = {
      PENDING: this.orders.filter((o) => o.status === AdminOrderStatus.PENDING).length,
      CONFIRMED: this.orders.filter((o) => o.status === AdminOrderStatus.CONFIRMED).length,
      PROCESSING: this.orders.filter((o) => o.status === AdminOrderStatus.PROCESSING).length,
      SHIPPED: this.orders.filter((o) => o.status === AdminOrderStatus.SHIPPED).length,
      DELIVERED: this.orders.filter((o) => o.status === AdminOrderStatus.DELIVERED).length,
      CANCELLED: this.orders.filter((o) => o.status === AdminOrderStatus.CANCELLED).length,
    };

    const recentOrders = this.orders.slice(0, 5).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      totalAmount: o.totalAmount,
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
    }));

    const topProviders = this.providers.slice(0, 5).map((p) => ({
      id: p.id,
      bussinessName: p.bussinessName,
      avg_ratting: p.avg_ratting,
      total_review: p.total_review,
      totalSales: p.price * 15,
      isApproved: p.isApproved,
    }));

    const monthlyRevenue = [
      { month: 'Jan', revenue: 28000, orders: 120 },
      { month: 'Feb', revenue: 32000, orders: 145 },
      { month: 'Mar', revenue: 35000, orders: 160 },
      { month: 'Apr', revenue: 38000, orders: 175 },
      { month: 'May', revenue: 40500, orders: 190 },
      { month: 'Jun', revenue: 42850, orders: 210 },
    ];

    const data: AdminDashboardOverviewDto = {
      totalUsers: Math.max(totalUsers, 1420),
      totalProducts: Math.max(totalProducts, 68),
      totalProviders: Math.max(totalProviders, 186),
      totalRevenue: Math.max(totalRevenue, 42850),
      userGrowthPercentage: 10.5,
      productGrowthPercentage: -5.0,
      providerGrowthPercentage: 12.0,
      revenueGrowthPercentage: 20.4,
      monthlyRevenue,
      orderStatusCounts,
      recentOrders,
      topProviders,
    };

    return {
      statusCode: 200,
      success: true,
      message: 'Admin dashboard overview retrieved successfully',
      data,
    };
  }

  async getStats(): Promise<AdminStatsResponseDto> {
    const data: StateDataDto = {
      totalUsers: Math.max(this.users.length, 1420),
      totalPartyPlans: 324,
      totalBookings: 890,
      totalOrders: this.orders.length + this.customOrders.length + 240,
    };

    return {
      statusCode: 200,
      success: true,
      data,
    };
  }

  // ==========================================
  // 2. USER MANAGEMENT (All Users)
  // ==========================================
  async getAllUsers(search?: string, role?: string, page = 1, limit = 50) {
    let filtered = [...this.users];

    if (role) {
      filtered = filtered.filter((u) => u.role.toUpperCase() === role.toUpperCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q),
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      statusCode: 200,
      success: true,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
      data: paginated,
    };
  }

  async getUserById(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return {
      statusCode: 200,
      success: true,
      data: user,
    };
  }

  async createUser(dto: any) {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: dto.name || 'New User',
      email: dto.email,
      phone: dto.phone || dto.phoneNumber || null,
      role: (dto.role || 'USER').toUpperCase(),
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      address: dto.address || null,
      profile_image: dto.profile_image || null,
      total_party_generated: 0,
    };

    this.users.unshift(newUser);
    return {
      statusCode: 201,
      success: true,
      message: 'User created successfully',
      data: newUser,
    };
  }

  async updateUser(id: string, dto: any) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    const updated = {
      ...this.users[userIndex],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updated;
    return {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: updated,
    };
  }

  async deleteUser(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    user.isDeleted = true;
    this.users = this.users.filter((u) => u.id !== id);

    return {
      statusCode: 200,
      success: true,
      message: `User '${id}' deleted successfully`,
      id,
    };
  }

  // ==========================================
  // 3. ORDERS MANAGEMENT
  // ==========================================
  async getOrders(query: AdminOrderQueryDto): Promise<PaginatedAdminOrdersResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    let filtered = [...this.orders];

    if (query.status) {
      filtered = filtered.filter((o) => o.status === query.status);
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const orders = filtered.slice(startIndex, startIndex + limit);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      data: {
        orders,
      },
    };
  }

  async getOrderById(id: string): Promise<AdminOrderDto> {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }
    return order;
  }

  async updateOrderStatus(id: string, status: AdminOrderStatus): Promise<AdminOrderDto> {
    const order = await this.getOrderById(id);
    order.status = status;
    order.updatedAt = new Date().toISOString();

    this.logAuditEvent(`Updated order ${order.orderNumber} status to ${status}`, 'Super Admin');
    return order;
  }

  async createOrder(dto: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: AdminOrderDto = {
      id: orderId,
      orderNumber,
      customerName: dto.shippingInfo?.name || 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: dto.shippingInfo?.phone || '+33 6 12 34 56 78',
      shippingAddress: {
        street: dto.shippingInfo?.address || '15 Rue de Paris',
        city: dto.shippingInfo?.city || 'Paris',
        state: dto.shippingInfo?.state || 'Île-de-France',
        zipCode: dto.shippingInfo?.zipCode || '75001',
        country: 'France',
      },
      subtotal: dto.totalPrice - (dto.shippingFee || 0),
      shippingFee: dto.shippingFee || 0,
      discount: 0,
      totalAmount: dto.totalPrice,
      status: AdminOrderStatus.PENDING,
      paymentStatus: AdminPaymentStatus.PENDING,
      paymentMethod: 'STRIPE',
      items: (dto.items || []).map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: 49.99,
        subtotal: 49.99 * item.quantity,
        product: {
          id: item.productId,
          title: 'Party Craft Product',
          price: 49.99,
          category: 'DIY Boxes',
        },
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.logAuditEvent(`New checkout order created: ${orderNumber}`, 'Customer Checkout');

    return {
      statusCode: 201,
      success: true,
      message: 'Order created successfully',
      data: {
        orderId,
        checkoutUrl: `https://checkout.stripe.com/pay/${orderId}`,
        paymentUrl: `https://checkout.stripe.com/pay/${orderId}`,
      },
    };
  }

  // ==========================================
  // 4. CUSTOM ORDERS MANAGEMENT
  // ==========================================
  async getCustomOrders(query: CustomOrderQueryDto): Promise<PaginatedCustomOrdersResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    let filtered = [...this.customOrders];

    if (query.status) {
      filtered = filtered.filter((o) => o.status.toUpperCase() === query.status?.toUpperCase());
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.theme?.toLowerCase().includes(q) ||
          o.tShirtType.toLowerCase().includes(q),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const orders = filtered.slice(startIndex, startIndex + limit);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      data: {
        orders,
      },
    };
  }

  async getCustomOrderById(id: string): Promise<CustomOrderItemDto> {
    const order = this.customOrders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Custom Order with ID '${id}' not found`);
    }
    return order;
  }

  async createCustomOrder(dto: CreateCustomOrderRequestDto): Promise<CreateCustomOrderResponseDto> {
    const id = `co-${Date.now()}`;
    const newCustomOrder: CustomOrderItemDto = {
      id,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      contactPhone: dto.contactPhone,
      tShirtType: dto.tShirtType,
      size: dto.size,
      quantity: dto.quantity,
      total: dto.total || dto.quantity * 25,
      status: 'PENDING',
      theme: dto.theme || 'Custom Theme',
      address: dto.address,
      optionalMessage: dto.optionalMessage,
      mockupUrl: dto.mockupUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      designUrl: dto.designUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.customOrders.unshift(newCustomOrder);
    this.logAuditEvent(`New custom t-shirt order placed: ${id} by ${dto.customerName}`, 'Customer Custom T-Shirt');

    return {
      statusCode: 201,
      success: true,
      message: 'Custom order created successfully',
      data: newCustomOrder,
    };
  }

  async updateCustomOrderStatus(id: string, status: string): Promise<CustomOrderItemDto> {
    const order = await this.getCustomOrderById(id);
    order.status = status;
    order.updatedAt = new Date().toISOString();

    this.logAuditEvent(`Updated custom order ${order.id} status to ${status}`, 'Super Admin');
    return order;
  }

  // ==========================================
  // 5. PROVIDER MANAGEMENT
  // ==========================================
  async getProviders(query: AdminProviderQueryDto): Promise<PaginatedAdminProvidersResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    let filtered = [...this.providers];

    if (query.search) {
      const q = query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.bussinessName.toLowerCase().includes(q) ||
          p.contactName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.serviceArea.toLowerCase().includes(q),
      );
    }

    if (query.serviceCategory) {
      const cat = query.serviceCategory.toLowerCase();
      filtered = filtered.filter((p) =>
        p.serviceCategory.some((c) => c.toLowerCase().includes(cat)),
      );
    }

    if (query.status) {
      filtered = filtered.filter((p) => p.status.toUpperCase() === query.status?.toUpperCase());
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      data,
    };
  }

  async getProviderById(id: string): Promise<AdminProviderItemDto> {
    const provider = this.providers.find((p) => p.id === id || p.userId === id);
    if (!provider) {
      throw new NotFoundException(`Provider with ID '${id}' not found`);
    }
    return provider;
  }

  async approveProvider(id: string): Promise<AdminProviderItemDto> {
    const provider = await this.getProviderById(id);
    provider.isApproved = true;
    provider.status = 'ACTIVE';
    provider.updatedAt = new Date().toISOString();

    this.logAuditEvent(`Approved provider onboarding application: ${provider.bussinessName}`, 'Compliance Admin');
    return provider;
  }

  async rejectProvider(id: string): Promise<AdminProviderItemDto> {
    const provider = await this.getProviderById(id);
    provider.isApproved = false;
    provider.status = 'SUSPENDED';
    provider.updatedAt = new Date().toISOString();

    this.logAuditEvent(`Rejected provider application: ${provider.bussinessName}`, 'Compliance Admin');
    return provider;
  }

  // ==========================================
  // 6. PRODUCT MANAGEMENT
  // ==========================================
  async getProducts(): Promise<ProductsApiResponseDto> {
    const diyBoxes = this.products.filter((p) => p.product_type === 'DIY_BOX' || p.category === 'DIY Boxes');
    const gifts = this.products.filter((p) => p.product_type === 'GIFT' || p.category === 'Gifts');

    return {
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
      data: {
        diyBoxes: diyBoxes.length > 0 ? diyBoxes : this.products.slice(0, 2),
        gifts: gifts.length > 0 ? gifts : this.products.slice(2),
      },
      all: this.products,
    };
  }

  async getProductById(id: string): Promise<SingleProductApiResponseDto> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async createProduct(dto: CreateAdminProductDto): Promise<SingleProductApiResponseDto> {
    const newProduct: AdminProductItemDto = {
      id: `prod-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      product_type: dto.product_type,
      age_range: dto.age_range,
      price: dto.price,
      discounted_price: dto.discounted_price,
      included: dto.included || [],
      tutorial: dto.tutorial || null,
      imges: dto.imges || ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'],
      avg_rating: 5.0,
      total_review: 0,
      theme: dto.theme,
      category: dto.category,
      up_to_kids: dto.up_to_kids || null,
      activities: dto.activities || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.unshift(newProduct);
    this.logAuditEvent(`Created new product catalog item: ${newProduct.title}`, 'Product Admin');

    return {
      statusCode: 201,
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async updateProduct(id: string, dto: UpdateAdminProductDto): Promise<SingleProductApiResponseDto> {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    const updated: AdminProductItemDto = {
      ...this.products[productIndex],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.products[productIndex] = updated;
    this.logAuditEvent(`Updated product catalog item: ${updated.title}`, 'Product Admin');

    return {
      statusCode: 200,
      success: true,
      message: 'Product updated successfully',
      data: updated,
    };
  }

  async deleteProduct(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    this.products = this.products.filter((p) => p.id !== id);
    this.logAuditEvent(`Deleted product catalog item: ${product.title}`, 'Product Admin');

    return {
      statusCode: 200,
      success: true,
      message: `Product '${id}' deleted successfully`,
      id,
    };
  }

  // ==========================================
  // 7. DIY ACTIVITY MANAGEMENT
  // ==========================================
  async getActivities(search?: string): Promise<DiyActivityResponseDto> {
    let filtered = [...this.activities];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.instructionSheet.toLowerCase().includes(q),
      );
    }

    return {
      statusCode: 200,
      success: true,
      data: filtered,
    };
  }

  async getActivityById(id: string): Promise<SingleDiyActivityResponseDto> {
    const act = this.activities.find((a) => a.id === id);
    if (!act) {
      throw new NotFoundException(`DIY Activity with ID '${id}' not found`);
    }
    return {
      statusCode: 200,
      success: true,
      data: act,
    };
  }

  async createActivity(dto: CreateAdminDiyActivityDto): Promise<SingleDiyActivityResponseDto> {
    const newActivity: AdminDiyActivityDto = {
      id: `act-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      instructionSheet: dto.instructionSheet,
      ageRange: dto.ageRange,
      videoUrl: dto.videoUrl,
      pdfUrl: dto.pdfUrl,
      pdfFileName: dto.pdfFileName,
      videoFileName: dto.videoFileName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.activities.unshift(newActivity);
    this.logAuditEvent(`Created DIY activity: ${newActivity.title}`, 'Content Admin');

    return {
      statusCode: 201,
      success: true,
      data: newActivity,
    };
  }

  async updateActivity(id: string, dto: UpdateAdminDiyActivityDto): Promise<SingleDiyActivityResponseDto> {
    const index = this.activities.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Activity with ID '${id}' not found`);
    }

    const updated = {
      ...this.activities[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.activities[index] = updated;
    return {
      statusCode: 200,
      success: true,
      data: updated,
    };
  }

  async deleteActivity(id: string) {
    const act = this.activities.find((a) => a.id === id);
    if (!act) {
      throw new NotFoundException(`Activity with ID '${id}' not found`);
    }

    this.activities = this.activities.filter((a) => a.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Activity '${id}' deleted successfully`,
      id,
    };
  }

  // ==========================================
  // 8. BLOG MANAGEMENT
  // ==========================================
  async getBlogs(): Promise<BlogsApiResponseDto> {
    return {
      statusCode: 200,
      success: true,
      message: 'Blogs retrieved successfully',
      data: this.blogs,
    };
  }

  async getBlogById(id: string): Promise<SingleBlogApiResponseDto> {
    const blog = this.blogs.find((b) => b.id === id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID '${id}' not found`);
    }
    return {
      statusCode: 200,
      success: true,
      message: 'Blog retrieved successfully',
      data: blog,
    };
  }

  async createBlog(dto: CreateAdminBlogDto): Promise<SingleBlogApiResponseDto> {
    const newBlog: AdminBlogDto = {
      id: `blog-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      conclusion: dto.conclusion,
      badge: dto.badge,
      tag: dto.tag,
      images: dto.images || ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.blogs.unshift(newBlog);
    this.logAuditEvent(`Published blog post: ${newBlog.title}`, 'Marketing Admin');

    return {
      statusCode: 201,
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    };
  }

  async updateBlog(id: string, dto: UpdateAdminBlogDto): Promise<SingleBlogApiResponseDto> {
    const index = this.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Blog with ID '${id}' not found`);
    }

    const updated = {
      ...this.blogs[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.blogs[index] = updated;
    return {
      statusCode: 200,
      success: true,
      message: 'Blog updated successfully',
      data: updated,
    };
  }

  async deleteBlog(id: string) {
    const blog = this.blogs.find((b) => b.id === id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID '${id}' not found`);
    }

    this.blogs = this.blogs.filter((b) => b.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Blog '${id}' deleted successfully`,
      id,
    };
  }

  // ==========================================
  // 9. AFFILIATED PRODUCTS MANAGEMENT
  // ==========================================
  async getAffiliatedProducts(): Promise<AffiliatedProductsResponseDto> {
    return {
      statusCode: 200,
      success: true,
      data: this.affiliatedProducts,
    };
  }

  async getAffiliatedProductById(id: string): Promise<SingleAffiliatedProductResponseDto> {
    const product = this.affiliatedProducts.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Affiliated product with ID '${id}' not found`);
    }
    return {
      statusCode: 200,
      success: true,
      data: product,
    };
  }

  async createAffiliatedProduct(dto: CreateAffiliatedProductDto): Promise<SingleAffiliatedProductResponseDto> {
    const newProduct: AdminAffiliatedProductDto = {
      id: `aff-${Date.now()}`,
      title: dto.title,
      price: dto.price,
      avgRating: dto.avgRating || 5.0,
      totalRatings: dto.totalRatings || 0,
      ageRange: dto.ageRange,
      imageUrl: dto.imageUrl,
      company: dto.company,
      productLink: dto.productLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.affiliatedProducts.unshift(newProduct);
    this.logAuditEvent(`Added affiliated product: ${newProduct.title}`, 'Marketing Admin');

    return {
      statusCode: 201,
      success: true,
      data: newProduct,
    };
  }

  async updateAffiliatedProduct(id: string, dto: UpdateAffiliatedProductDto): Promise<SingleAffiliatedProductResponseDto> {
    const index = this.affiliatedProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Affiliated product with ID '${id}' not found`);
    }

    const updated = {
      ...this.affiliatedProducts[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.affiliatedProducts[index] = updated;
    return {
      statusCode: 200,
      success: true,
      data: updated,
    };
  }

  async deleteAffiliatedProduct(id: string) {
    const item = this.affiliatedProducts.find((p) => p.id === id);
    if (!item) {
      throw new NotFoundException(`Affiliated product with ID '${id}' not found`);
    }

    this.affiliatedProducts = this.affiliatedProducts.filter((p) => p.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Affiliated product '${id}' deleted successfully`,
      id,
    };
  }

  // ==========================================
  // 10. NEWSLETTER SUBSCRIBERS & CAMPAIGNS
  // ==========================================
  async getNewsletterSubscribers(): Promise<NewsletterResponseDto> {
    return {
      statusCode: 200,
      success: true,
      data: this.subscribers,
    };
  }

  async createNewsletterSubscriber(dto: CreateNewsletterSubscriberDto) {
    const existing = this.subscribers.find((s) => s.email.toLowerCase() === dto.email.toLowerCase());
    if (existing) {
      return {
        statusCode: 200,
        success: true,
        message: 'Email is already subscribed to newsletter',
        data: existing,
      };
    }

    const newSub: NewsletterSubscriberDto = {
      id: `sub-${Date.now()}`,
      no: this.subscribers.length + 1,
      email: dto.email,
      subscribedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    this.subscribers.unshift(newSub);
    return {
      statusCode: 201,
      success: true,
      message: 'Subscribed to newsletter successfully',
      data: newSub,
    };
  }

  async sendNewsletterCampaign(dto: SendNewsletterCampaignDto) {
    this.logAuditEvent(`Sent newsletter campaign: '${dto.subject}' to ${this.subscribers.length} subscribers`, 'Marketing Admin');
    return {
      statusCode: 200,
      success: true,
      message: `Newsletter campaign dispatched successfully to ${this.subscribers.length} active subscribers.`,
      dispatchedCount: this.subscribers.length,
      subject: dto.subject,
    };
  }

  async deleteNewsletterSubscriber(id: string) {
    const index = this.subscribers.findIndex((s) => s.id === id || s.email === id);
    if (index === -1) {
      throw new NotFoundException(`Subscriber with ID '${id}' not found`);
    }

    this.subscribers.splice(index, 1);
    return {
      statusCode: 200,
      success: true,
      message: `Subscriber '${id}' unsubscribed successfully`,
    };
  }

  // ==========================================
  // 11. CONTACT MESSAGES / INQUIRIES
  // ==========================================
  async getContactMessages(): Promise<ContactResponseDto> {
    return {
      statusCode: 200,
      success: true,
      data: this.contactMessages,
    };
  }

  async getContactMessageById(id: string): Promise<ContactMessageDto> {
    const msg = this.contactMessages.find((c) => c.id === id);
    if (!msg) {
      throw new NotFoundException(`Contact inquiry with ID '${id}' not found`);
    }
    return msg;
  }

  async createContactMessage(dto: CreateContactMessageDto) {
    const newMsg: ContactMessageDto = {
      id: `ct-${Date.now()}`,
      no: this.contactMessages.length + 1,
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.contactMessages.unshift(newMsg);
    return {
      statusCode: 201,
      success: true,
      message: 'Inquiry message submitted successfully',
      data: newMsg,
    };
  }

  async updateContactStatus(id: string, status: string): Promise<ContactMessageDto> {
    const msg = await this.getContactMessageById(id);
    msg.status = status;
    this.logAuditEvent(`Updated contact inquiry ${id} status to ${status}`, 'Support Admin');
    return msg;
  }

  async deleteContactMessage(id: string) {
    const msg = this.contactMessages.find((c) => c.id === id);
    if (!msg) {
      throw new NotFoundException(`Contact inquiry with ID '${id}' not found`);
    }

    this.contactMessages = this.contactMessages.filter((c) => c.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Contact message '${id}' deleted successfully`,
    };
  }

  // ==========================================
  // 12. REVIEWS & TESTIMONIALS MANAGEMENT
  // ==========================================
  async getReviews(): Promise<ReviewsResponseDto> {
    return {
      statusCode: 200,
      success: true,
      data: this.reviews,
    };
  }

  async createReview(dto: CreateAdminReviewDto) {
    const newRev: AdminReviewDto = {
      id: `rev-${Date.now()}`,
      name: dto.name,
      imageUrl: dto.imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      review: dto.review,
      rating: dto.rating,
      type: dto.type || 'Happy Parents',
      status: dto.status || 'Active',
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newRev);
    this.logAuditEvent(`Created client testimonial review from: ${newRev.name}`, 'Content Admin');

    return {
      statusCode: 201,
      success: true,
      data: newRev,
    };
  }

  async updateReview(id: string, dto: UpdateAdminReviewDto) {
    const index = this.reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundException(`Review with ID '${id}' not found`);
    }

    const updated = {
      ...this.reviews[index],
      ...dto,
    };

    this.reviews[index] = updated;
    return {
      statusCode: 200,
      success: true,
      data: updated,
    };
  }

  async deleteReview(id: string) {
    const rev = this.reviews.find((r) => r.id === id);
    if (!rev) {
      throw new NotFoundException(`Review with ID '${id}' not found`);
    }

    this.reviews = this.reviews.filter((r) => r.id !== id);
    return {
      statusCode: 200,
      success: true,
      message: `Review '${id}' deleted successfully`,
    };
  }

  // ==========================================
  // 13. SYSTEM DEFAULTS & AUDIT LOGS
  // ==========================================
  async getSettings(): Promise<SystemSettingsResponseDto> {
    return {
      statusCode: 200,
      success: true,
      data: this.systemDefaults,
    };
  }

  async updateSettings(dto: UpdateSystemDefaultsDto): Promise<SystemSettingsResponseDto> {
    this.systemDefaults = {
      ...this.systemDefaults,
      ...dto,
    };

    this.logAuditEvent('Updated system settings & defaults configuration', 'Super Admin (Alexandre)');

    return {
      statusCode: 200,
      success: true,
      data: this.systemDefaults,
    };
  }

  async getAuditLogs(): Promise<AuditLogsResponseDto> {
    return {
      statusCode: 200,
      success: true,
      data: this.auditLogs,
    };
  }

  private logAuditEvent(action: string, admin = 'Super Admin') {
    const log: AuditLogItemDto = {
      id: `log-${Date.now()}`,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      admin,
    };
    this.auditLogs.unshift(log);
  }
}

