import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProviderService } from './provider.service.js';
import { DashboardStatsResponseDto } from './dto/dashboard-stats.dto.js';
import { ProviderProfileDto } from './dto/provider-profile.dto.js';
import { UpdateProviderProfileDto } from './dto/update-provider-profile.dto.js';
import {
  PaginatedProductsResponseDto,
  ProductDto,
  ProductStatus,
} from './dto/product.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto, UpdateProductStatusDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { OrderDto, PaginatedOrdersResponseDto } from './dto/order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { OrderQueryDto } from './dto/order-query.dto.js';
import {
  PayoutHistoryResponseDto,
  PayoutSummaryDto,
} from './dto/payout.dto.js';
import { RequestPayoutDto, RequestPayoutResponseDto } from './dto/request-payout.dto.js';
import { PaginatedReviewsResponseDto, ReviewQueryDto } from './dto/review.dto.js';
import { ReplyReviewDto, ReplyReviewResponseDto } from './dto/reply-review.dto.js';

@ApiTags('Provider Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  // ==========================================
  // 1. DASHBOARD OVERVIEW & ANALYTICS
  // ==========================================
  @Get('dashboard/stats')
  @ApiOperation({
    summary: 'Get Provider Dashboard Overview Statistics',
    description:
      'Retrieve key performance metrics, revenue growth, sales analytics charts, order status distribution, top-selling products, and recent orders for the seller dashboard.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully.',
    type: DashboardStatsResponseDto,
  })
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    return this.providerService.getDashboardStats();
  }

  // ==========================================
  // 2. STORE PROFILE & SETTINGS
  // ==========================================
  @Get('profile')
  @ApiOperation({
    summary: 'Get Provider Store Profile',
    description:
      'Retrieve the provider store information, verified badge, description, addresses, and configured payout account details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider store profile retrieved successfully.',
    type: ProviderProfileDto,
  })
  async getProfile(): Promise<ProviderProfileDto> {
    return this.providerService.getProfile();
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update Provider Store Profile & Settings',
    description:
      'Update the store name, description, branding logos, contact details, business tax ID, and banking/payout configurations.',
  })
  @ApiBody({ type: UpdateProviderProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Provider store profile updated successfully.',
    type: ProviderProfileDto,
  })
  async updateProfile(
    @Body() updateDto: UpdateProviderProfileDto,
  ): Promise<ProviderProfileDto> {
    return this.providerService.updateProfile(updateDto);
  }

  // ==========================================
  // 3. PRODUCTS MANAGEMENT
  // ==========================================
  @Get('products')
  @ApiOperation({
    summary: 'List Provider Products',
    description:
      'Retrieve a paginated list of catalog products belonging to this provider with keyword search, category filter, listing status filter, and custom sorting.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
    type: PaginatedProductsResponseDto,
  })
  async getProducts(@Query() queryDto: ProductQueryDto): Promise<PaginatedProductsResponseDto> {
    return this.providerService.getProducts(queryDto);
  }

  @Get('products/:id')
  @ApiOperation({
    summary: 'Get Single Product Details',
    description: 'Retrieve full specification, pricing, stock levels, and media images for a specific product ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique product ID',
    example: 'prd-101',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully.',
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product with specified ID was not found.',
  })
  async getProductById(@Param('id') id: string): Promise<ProductDto> {
    return this.providerService.getProductById(id);
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create New Product Listing',
    description:
      'Add a new merchandise or inventory item to the provider catalog with images, categories, SKU, price, and inventory count.',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    type: ProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (e.g., negative prices, empty title, invalid status).',
  })
  async createProduct(@Body() createDto: CreateProductDto): Promise<ProductDto> {
    return this.providerService.createProduct(createDto);
  }

  @Patch('products/:id')
  @ApiOperation({
    summary: 'Update Product Information',
    description: 'Modify title, description, price, inventory stock, images, or tags of an existing product.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique product ID',
    example: 'prd-101',
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.providerService.updateProduct(id, updateDto);
  }

  @Patch('products/:id/status')
  @ApiOperation({
    summary: 'Change Product Status',
    description: 'Quickly toggle a product between ACTIVE, DRAFT, OUT_OF_STOCK, and ARCHIVED states.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique product ID',
    example: 'prd-101',
  })
  @ApiBody({ type: UpdateProductStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Product status changed successfully.',
    type: ProductDto,
  })
  async updateProductStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateProductStatusDto,
  ): Promise<ProductDto> {
    return this.providerService.updateProductStatus(id, statusDto.status as ProductStatus);
  }

  @Delete('products/:id')
  @ApiOperation({
    summary: 'Delete Product Listing',
    description: 'Remove a product from the provider store inventory.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique product ID',
    example: 'prd-106',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.providerService.deleteProduct(id);
  }

  // ==========================================
  // 4. ORDERS MANAGEMENT & FULFILLMENT
  // ==========================================
  @Get('orders')
  @ApiOperation({
    summary: 'List Provider Orders',
    description:
      'Retrieve a paginated list of customer orders for this provider. Supports filtering by fulfillment status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED), keyword search, and date ranges.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
    type: PaginatedOrdersResponseDto,
  })
  async getOrders(@Query() queryDto: OrderQueryDto): Promise<PaginatedOrdersResponseDto> {
    return this.providerService.getOrders(queryDto);
  }

  @Get('orders/:id')
  @ApiOperation({
    summary: 'Get Order Details & Timeline',
    description:
      'Retrieve comprehensive order information including customer contact, shipping address, line items, payment status, tracking number, and status progression timeline.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID or Order Reference Number',
    example: 'ord-8910',
  })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully.',
    type: OrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async getOrderById(@Param('id') id: string): Promise<OrderDto> {
    return this.providerService.getOrderById(id);
  }

  @Patch('orders/:id/status')
  @ApiOperation({
    summary: 'Update Order Fulfillment Status',
    description:
      'Advance or change order status (e.g. mark as PROCESSING, SHIPPED with tracking number, DELIVERED, or CANCELLED) and log notes to the order timeline.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'ord-8910',
  })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
    type: OrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return this.providerService.updateOrderStatus(id, updateDto);
  }

  // ==========================================
  // 5. EARNINGS & PAYOUTS
  // ==========================================
  @Get('payouts/summary')
  @ApiOperation({
    summary: 'Get Earnings & Payout Balance Summary',
    description:
      'Retrieve current available cleared balance, pending clearance balance, lifetime total earnings, and total withdrawn amounts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payout summary retrieved successfully.',
    type: PayoutSummaryDto,
  })
  async getPayoutSummary(): Promise<PayoutSummaryDto> {
    return this.providerService.getPayoutSummary();
  }

  @Get('payouts/history')
  @ApiOperation({
    summary: 'Get Payout Withdrawal History',
    description: 'Retrieve list of all previous withdrawal requests with status, payment method, dates, and amounts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payout history retrieved successfully.',
    type: PayoutHistoryResponseDto,
  })
  async getPayoutHistory(): Promise<PayoutHistoryResponseDto> {
    return this.providerService.getPayoutHistory();
  }

  @Post('payouts/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Request Payout / Balance Withdrawal',
    description:
      'Submit a new withdrawal request to transfer cleared merchant funds to bank account, mobile money (bKash/Nagad), or PayPal.',
  })
  @ApiBody({ type: RequestPayoutDto })
  @ApiResponse({
    status: 201,
    description: 'Payout request initiated successfully.',
    type: RequestPayoutResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient available balance or amount below minimum payout limit.',
  })
  async requestPayout(
    @Body() requestDto: RequestPayoutDto,
  ): Promise<RequestPayoutResponseDto> {
    return this.providerService.requestPayout(requestDto);
  }

  // ==========================================
  // 6. CUSTOMER REVIEWS & RATINGS
  // ==========================================
  @Get('reviews')
  @ApiOperation({
    summary: 'List Provider Store & Product Reviews',
    description:
      'Retrieve customer feedback, star ratings, and review comments for products sold by this provider with rating and product filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully.',
    type: PaginatedReviewsResponseDto,
  })
  async getReviews(@Query() queryDto: ReviewQueryDto): Promise<PaginatedReviewsResponseDto> {
    return this.providerService.getReviews(queryDto);
  }

  @Post('reviews/:id/reply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reply to Customer Review',
    description: 'Post an official merchant store response to a customer review.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    example: 'rev-502',
  })
  @ApiBody({ type: ReplyReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Reply submitted successfully.',
    type: ReplyReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  async replyReview(
    @Param('id') id: string,
    @Body() replyDto: ReplyReviewDto,
  ): Promise<ReplyReviewResponseDto> {
    return this.providerService.replyReview(id, replyDto);
  }
}
