import {
  Body,
  Controller,
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
import { AdminService } from './admin.service.js';
import {
  AdminOrderDto,
  AdminOrderQueryDto,
  CreateOrderRequestDto,
  CreateOrderResponseDto,
  PaginatedAdminOrdersResponseDto,
  UpdateAdminOrderStatusDto,
} from './dto/admin-order.dto.js';
import {
  CreateCustomOrderRequestDto,
  CreateCustomOrderResponseDto,
  CustomOrderItemDto,
  CustomOrderQueryDto,
  PaginatedCustomOrdersResponseDto,
  UpdateCustomOrderStatusDto,
} from './dto/admin-custom-order.dto.js';

@ApiBearerAuth('JWT-auth')
@Controller()
export class OrdersController {
  constructor(private readonly adminService: AdminService) {}

  // ==========================================
  // STANDARD ORDERS API
  // ==========================================
  @ApiTags('Orders')
  @Get('orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Orders (Admin & Customer)',
    description:
      'Retrieve paginated customer orders with search filtering, status filters (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED), and customer info.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated orders retrieved successfully.',
    type: PaginatedAdminOrdersResponseDto,
  })
  async getOrders(
    @Query() query: AdminOrderQueryDto,
  ): Promise<PaginatedAdminOrdersResponseDto> {
    return this.adminService.getOrders(query);
  }

  @ApiTags('Orders')
  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Checkout Order',
    description: 'Place a new order with line items, shipping address, and generate checkout payment URL.',
  })
  @ApiBody({ type: CreateOrderRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
    type: CreateOrderResponseDto,
  })
  async createOrder(@Body() dto: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    return this.adminService.createOrder(dto);
  }

  @ApiTags('Orders')
  @Get('orders/my-orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get My Orders (Customer / Admin Personal Orders)',
    description: 'Retrieve order history for the logged-in user or admin account.',
  })
  @ApiResponse({
    status: 200,
    description: 'My orders list retrieved successfully.',
    type: PaginatedAdminOrdersResponseDto,
  })
  async getMyOrders(
    @Query() query: AdminOrderQueryDto,
  ): Promise<PaginatedAdminOrdersResponseDto> {
    return this.adminService.getOrders(query);
  }

  @ApiTags('Orders')
  @Get('orders/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Order by ID',
    description: 'Retrieve detailed order information including line items, shipping address, and tracking data.',
  })
  @ApiParam({ name: 'id', description: 'Order ID or Order Number', example: 'ord-101' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully.',
    type: AdminOrderDto,
  })
  async getOrderById(@Param('id') id: string): Promise<AdminOrderDto> {
    return this.adminService.getOrderById(id);
  }

  @ApiTags('Orders')
  @Patch('orders/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Order Status',
    description: 'Update the fulfillment status of an order (e.g. to CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED).',
  })
  @ApiParam({ name: 'id', description: 'Order ID or Order Number', example: 'ord-101' })
  @ApiBody({ type: UpdateAdminOrderStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
    type: AdminOrderDto,
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdminOrderStatusDto,
  ): Promise<AdminOrderDto> {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  // ==========================================
  // CUSTOM T-SHIRT & BESPOKE ORDERS API
  // ==========================================
  @ApiTags('Admin Custom Orders')
  @Get('custom-orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Custom Orders (Admin Dashboard)',
    description:
      'Retrieve paginated custom t-shirt and customized merchandise orders with status, size breakdown, theme, and artwork mockups.',
  })
  @ApiResponse({
    status: 200,
    description: 'Custom orders retrieved successfully.',
    type: PaginatedCustomOrdersResponseDto,
  })
  async getCustomOrders(
    @Query() query: CustomOrderQueryDto,
  ): Promise<PaginatedCustomOrdersResponseDto> {
    return this.adminService.getCustomOrders(query);
  }

  @ApiTags('Admin Custom Orders')
  @Post('custom-orders')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Custom T-Shirt / Bespoke Order',
    description: 'Submit a new tailored merchandise order with custom sizes, print instructions, and artwork mockup URLs.',
  })
  @ApiBody({ type: CreateCustomOrderRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Custom order created successfully.',
    type: CreateCustomOrderResponseDto,
  })
  async createCustomOrder(@Body() dto: CreateCustomOrderRequestDto): Promise<CreateCustomOrderResponseDto> {
    return this.adminService.createCustomOrder(dto);
  }

  @ApiTags('Admin Custom Orders')
  @Get('custom-orders/my-orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get My Custom Orders',
    description: 'Retrieve user custom t-shirt design order history.',
  })
  @ApiResponse({
    status: 200,
    description: 'User custom orders retrieved successfully.',
    type: PaginatedCustomOrdersResponseDto,
  })
  async getMyCustomOrders(
    @Query() query: CustomOrderQueryDto,
  ): Promise<PaginatedCustomOrdersResponseDto> {
    return this.adminService.getCustomOrders(query);
  }

  @ApiTags('Admin Custom Orders')
  @Get('custom-orders/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Custom Order by ID',
    description: 'Retrieve custom order artwork, mockups, printing notes, and shipping address.',
  })
  @ApiParam({ name: 'id', description: 'Custom Order ID', example: 'co-1' })
  @ApiResponse({
    status: 200,
    description: 'Custom order details retrieved successfully.',
    type: CustomOrderItemDto,
  })
  async getCustomOrderById(@Param('id') id: string): Promise<CustomOrderItemDto> {
    return this.adminService.getCustomOrderById(id);
  }

  @ApiTags('Admin Custom Orders')
  @Patch('custom-orders/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Custom Order Status',
    description: 'Transition custom production status (PENDING, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED).',
  })
  @ApiParam({ name: 'id', description: 'Custom Order ID', example: 'co-1' })
  @ApiBody({ type: UpdateCustomOrderStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Custom order status updated successfully.',
    type: CustomOrderItemDto,
  })
  async updateCustomOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCustomOrderStatusDto,
  ): Promise<CustomOrderItemDto> {
    return this.adminService.updateCustomOrderStatus(id, dto.status);
  }
}
