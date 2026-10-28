import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  DashboardStatsResponseDto,
  OrderStatusDistributionDto,
  RecentOrderSummaryDto,
  TopSellingProductDto,
} from './dto/dashboard-stats.dto.js';
import { ProviderProfileDto } from './dto/provider-profile.dto.js';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto.js';
import { PaginatedProductsResponseDto, ProductDto, ProductStatus } from './dto/product.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { OrderDto, OrderStatus, PaymentStatus, PaginatedOrdersResponseDto } from './dto/order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { OrderQueryDto } from './dto/order-query.dto.js';
import {
  PayoutHistoryItemDto,
  PayoutHistoryResponseDto,
  PayoutStatus,
  PayoutSummaryDto,
} from './dto/payout.dto.js';
import { RequestPayoutDto, RequestPayoutResponseDto } from './dto/request-payout.dto.js';
import { PaginatedReviewsResponseDto, ReviewDto, ReviewQueryDto } from './dto/review.dto.js';
import { ReplyReviewDto, ReplyReviewResponseDto } from './dto/reply-review.dto.js';
import {
  INITIAL_ORDERS,
  INITIAL_PAYOUT_SUMMARY,
  INITIAL_PAYOUTS,
  INITIAL_PRODUCTS,
  INITIAL_PROVIDER_PROFILE,
  INITIAL_REVIEWS,
  SALES_ANALYTICS_DATA,
} from './mock-provider-data.js';

@Injectable()
export class ProviderService {
  // In-memory data store for persistent updates during runtime / demo
  private profile: ProviderProfileDto = { ...INITIAL_PROVIDER_PROFILE };
  private products: ProductDto[] = [...INITIAL_PRODUCTS];
  private orders: OrderDto[] = [...INITIAL_ORDERS];
  private payouts: PayoutHistoryItemDto[] = [...INITIAL_PAYOUTS];
  private payoutSummary: PayoutSummaryDto = { ...INITIAL_PAYOUT_SUMMARY };
  private reviews: ReviewDto[] = [...INITIAL_REVIEWS];

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // 1. DASHBOARD ANALYTICS & STATS
  // ==========================================
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter((o) => o.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = this.orders.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED,
    ).length;

    const lowStockCount = this.products.filter(
      (p) => p.stockQuantity <= 5 && p.status !== ProductStatus.ARCHIVED,
    ).length;

    const orderDistribution: OrderStatusDistributionDto = {
      pending: this.orders.filter((o) => o.status === OrderStatus.PENDING).length,
      processing: this.orders.filter((o) => o.status === OrderStatus.PROCESSING).length,
      shipped: this.orders.filter((o) => o.status === OrderStatus.SHIPPED).length,
      delivered: this.orders.filter((o) => o.status === OrderStatus.DELIVERED).length,
      cancelled: this.orders.filter((o) => o.status === OrderStatus.CANCELLED).length,
    };

    const topProducts: TopSellingProductDto[] = [...this.products]
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        soldCount: p.totalSold,
        revenue: Number((p.totalSold * p.price).toFixed(2)),
        rating: p.rating,
        imageUrl: p.images[0] ?? '',
      }));

    const recentOrders: RecentOrderSummaryDto[] = [...this.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customer.name,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        itemsCount: o.items.length,
        createdAt: o.createdAt,
      }));

    const averageRating =
      this.reviews.length > 0
        ? Number(
            (this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length).toFixed(2),
          )
        : 5.0;

    return {
      metrics: {
        totalRevenue: Number((24500 + totalRevenue).toFixed(2)),
        revenueGrowth: 18.4,
        totalOrders: 340 + totalOrders,
        ordersGrowth: 12.8,
        totalProducts: this.products.length,
        lowStockCount,
        averageRating,
        totalReviews: 195 + this.reviews.length,
        pendingOrders,
      },
      salesAnalytics: SALES_ANALYTICS_DATA,
      orderStatusDistribution: orderDistribution,
      topProducts,
      recentOrders,
    };
  }

  // ==========================================
  // 2. PROVIDER PROFILE & STORE SETTINGS
  // ==========================================
  async getProfile(): Promise<ProviderProfileDto> {
    return this.profile;
  }

  async updateProfile(dto: UpdateProviderProfileDto): Promise<ProviderProfileDto> {
    this.profile = {
      ...this.profile,
      ...(dto.storeName && {
        storeName: dto.storeName,
        storeSlug: dto.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.logoUrl && { logoUrl: dto.logoUrl }),
      ...(dto.bannerUrl && { bannerUrl: dto.bannerUrl }),
      ...(dto.contactPhone && { contactPhone: dto.contactPhone }),
      ...(dto.contactEmail && { contactEmail: dto.contactEmail }),
      ...(dto.address && { address: dto.address }),
      ...(dto.city && { city: dto.city }),
      ...(dto.country && { country: dto.country }),
      ...(dto.taxId && { taxId: dto.taxId }),
      ...(dto.payoutSettings && {
        payoutSettings: { ...this.profile.payoutSettings, ...dto.payoutSettings },
      }),
      updatedAt: new Date().toISOString(),
    };

    return this.profile;
  }

  // ==========================================
  // 3. PRODUCTS MANAGEMENT
  // ==========================================
  async getProducts(query: ProductQueryDto): Promise<PaginatedProductsResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status = 'ALL',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    let filtered = [...this.products];

    // Status filter
    if (status && status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Search query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof ProductDto];
      let valB: any = b[sortBy as keyof ProductDto];

      if (sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getProductById(id: string): Promise<ProductDto> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }
    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<ProductDto> {
    const id = `prd-${Date.now().toString().slice(-6)}`;
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const now = new Date().toISOString();

    const newProduct: ProductDto = {
      id,
      providerId: this.profile.id,
      title: dto.title,
      slug,
      description: dto.description,
      price: dto.price,
      compareAtPrice: dto.compareAtPrice,
      costPerItem: dto.costPerItem,
      stockQuantity: dto.stockQuantity,
      sku: dto.sku,
      category: dto.category,
      images: dto.images,
      tags: dto.tags ?? [],
      isFeatured: dto.isFeatured ?? false,
      status:
        dto.status ??
        (dto.stockQuantity > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK),
      rating: 5.0,
      reviewsCount: 0,
      totalSold: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }

    const current = this.products[index]!;
    const updated: ProductDto = {
      ...current,
      ...(dto.title && {
        title: dto.title,
        slug: dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.compareAtPrice !== undefined && { compareAtPrice: dto.compareAtPrice }),
      ...(dto.costPerItem !== undefined && { costPerItem: dto.costPerItem }),
      ...(dto.stockQuantity !== undefined && {
        stockQuantity: dto.stockQuantity,
        status:
          dto.stockQuantity === 0 && current.status === ProductStatus.ACTIVE
            ? ProductStatus.OUT_OF_STOCK
            : (dto.status ?? current.status),
      }),
      ...(dto.sku && { sku: dto.sku }),
      ...(dto.category && { category: dto.category }),
      ...(dto.images && { images: dto.images }),
      ...(dto.tags && { tags: dto.tags }),
      ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
      ...(dto.status && { status: dto.status }),
      updatedAt: new Date().toISOString(),
    };

    this.products[index] = updated;
    return updated;
  }

  async updateProductStatus(id: string, status: ProductStatus): Promise<ProductDto> {
    const product = await this.getProductById(id);
    product.status = status;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }

    this.products.splice(index, 1);
    return {
      success: true,
      message: `Product "${id}" deleted successfully.`,
    };
  }

  // ==========================================
  // 4. ORDERS FULFILLMENT
  // ==========================================
  async getOrders(query: OrderQueryDto): Promise<PaginatedOrdersResponseDto> {
    const { page = 1, limit = 10, search, status = 'ALL', dateFrom, dateTo, sortOrder = 'desc' } =
      query;

    let filtered = [...this.orders];

    // Status filter
    if (status && status !== 'ALL') {
      filtered = filtered.filter((o) => o.status === status);
    }

    // Search query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q),
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (o) => new Date(o.createdAt).getTime() >= new Date(dateFrom).getTime(),
      );
    }
    if (dateTo) {
      const toTime = new Date(dateTo).setHours(23, 59, 59, 999);
      filtered = filtered.filter((o) => new Date(o.createdAt).getTime() <= toTime);
    }

    // Sorting
    filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getOrderById(id: string): Promise<OrderDto> {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" was not found.`);
    }
    return order;
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderDto> {
    const order = await this.getOrderById(id);
    const now = new Date().toISOString();

    order.status = dto.status;
    if (dto.trackingNumber) {
      order.trackingNumber = dto.trackingNumber;
    }
    if (dto.carrier) {
      order.carrier = dto.carrier;
    }
    order.updatedAt = now;

    // Append to fulfillment timeline
    order.timeline.push({
      status: dto.status,
      note: dto.note || `Order marked as ${dto.status}`,
      timestamp: now,
    });

    // If delivered, update financial balances
    if (dto.status === OrderStatus.DELIVERED) {
      this.payoutSummary.availableBalance = Number(
        (this.payoutSummary.availableBalance + order.totalAmount).toFixed(2),
      );
    }

    return order;
  }

  // ==========================================
  // 5. EARNINGS & PAYOUTS MANAGEMENT
  // ==========================================
  async getPayoutSummary(): Promise<PayoutSummaryDto> {
    return this.payoutSummary;
  }

  async getPayoutHistory(): Promise<PayoutHistoryResponseDto> {
    return {
      payouts: this.payouts,
      total: this.payouts.length,
    };
  }

  async requestPayout(dto: RequestPayoutDto): Promise<RequestPayoutResponseDto> {
    if (dto.amount > this.payoutSummary.availableBalance) {
      throw new BadRequestException(
        `Requested payout amount ($${dto.amount}) exceeds your available cleared balance of $${this.payoutSummary.availableBalance}.`,
      );
    }

    if (dto.amount < this.payoutSummary.minimumPayoutAmount) {
      throw new BadRequestException(
        `Requested payout amount must be at least the minimum threshold of $${this.payoutSummary.minimumPayoutAmount}.`,
      );
    }

    // Deduct from available balance, add to pending
    this.payoutSummary.availableBalance = Number(
      (this.payoutSummary.availableBalance - dto.amount).toFixed(2),
    );
    this.payoutSummary.pendingBalance = Number(
      (this.payoutSummary.pendingBalance + dto.amount).toFixed(2),
    );

    const newPayout: PayoutHistoryItemDto = {
      id: `pay-${Date.now().toString().slice(-6)}`,
      referenceNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: dto.amount,
      currency: this.payoutSummary.currency,
      status: PayoutStatus.PENDING,
      paymentMethod: dto.paymentMethod,
      destinationAccount: dto.accountDetails,
      note: dto.note,
      requestedAt: new Date().toISOString(),
    };

    this.payouts.unshift(newPayout);

    return {
      success: true,
      message: `Payout request of $${dto.amount.toFixed(2)} submitted successfully. Our finance department will review and disburse within 1-2 business days.`,
      payout: newPayout,
    };
  }

  // ==========================================
  // 6. CUSTOMER REVIEWS & RATINGS
  // ==========================================
  async getReviews(query: ReviewQueryDto): Promise<PaginatedReviewsResponseDto> {
    const { page = 1, limit = 10, rating, productId } = query;

    let filtered = [...this.reviews];

    if (rating) {
      filtered = filtered.filter((r) => r.rating === rating);
    }

    if (productId) {
      filtered = filtered.filter((r) => r.productId === productId);
    }

    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async replyReview(id: string, dto: ReplyReviewDto): Promise<ReplyReviewResponseDto> {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) {
      throw new NotFoundException(`Review with ID "${id}" was not found.`);
    }

    const now = new Date().toISOString();
    review.providerReply = dto.reply;
    review.repliedAt = now;

    return {
      success: true,
      message: 'Reply posted successfully.',
      review,
    };
  }
}
