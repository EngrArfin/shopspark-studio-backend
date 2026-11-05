import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum AdminOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum AdminPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class OrderShippingAddressDto {
  @ApiProperty({ example: '15 Rue de Paris' })
  street: string;

  @ApiProperty({ example: 'Paris' })
  city: string;

  @ApiProperty({ example: 'Île-de-France' })
  state: string;

  @ApiProperty({ example: '75001' })
  zipCode: string;

  @ApiProperty({ example: 'France' })
  country: string;
}

export class OrderProductSummaryDto {
  @ApiProperty({ example: 'prod-001' })
  id: string;

  @ApiProperty({ example: 'Safari Adventure Explorer DIY Party Box' })
  title: string;

  @ApiPropertyOptional({ example: 'Complete DIY party craft box' })
  description?: string;

  @ApiProperty({ example: 49.99 })
  price: number;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d'] })
  imges?: string[];

  @ApiPropertyOptional({ example: 'DIY Boxes' })
  category?: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'item-1' })
  id: string;

  @ApiPropertyOptional({ example: 'ord-101' })
  orderId?: string;

  @ApiProperty({ example: 'prod-001' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiPropertyOptional({ example: 49.99 })
  unitPrice?: number;

  @ApiPropertyOptional({ example: 99.98 })
  subtotal?: number;

  @ApiProperty({ type: OrderProductSummaryDto })
  product: OrderProductSummaryDto;
}

export class AdminOrderDto {
  @ApiProperty({ example: 'ord-101' })
  id: string;

  @ApiProperty({ example: 'ORD-2026-9841' })
  orderNumber: string;

  @ApiProperty({ example: 'Arthur Pendelton' })
  customerName: string;

  @ApiProperty({ example: 'arthur.pendelton@example.com' })
  customerEmail: string;

  @ApiPropertyOptional({ example: '+33 6 12 34 56 78' })
  customerPhone?: string;

  @ApiProperty({ type: OrderShippingAddressDto })
  shippingAddress: OrderShippingAddressDto;

  @ApiProperty({ example: 99.98 })
  subtotal: number;

  @ApiProperty({ example: 10.0 })
  shippingFee: number;

  @ApiProperty({ example: 0 })
  discount: number;

  @ApiProperty({ example: 109.98 })
  totalAmount: number;

  @ApiProperty({ enum: AdminOrderStatus, example: AdminOrderStatus.CONFIRMED })
  status: AdminOrderStatus;

  @ApiProperty({ enum: AdminPaymentStatus, example: AdminPaymentStatus.PAID })
  paymentStatus: AdminPaymentStatus;

  @ApiProperty({ example: 'STRIPE' })
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'TRK-9842109' })
  trackingNumber?: string;

  @ApiPropertyOptional({ example: 'DHL Express' })
  carrier?: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ example: '2026-10-24T14:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-24T14:30:00.000Z' })
  updatedAt: string;
}

export class UpdateAdminOrderStatusDto {
  @ApiProperty({ enum: AdminOrderStatus, example: AdminOrderStatus.SHIPPED })
  @IsEnum(AdminOrderStatus)
  status: AdminOrderStatus;
}

export class AdminOrderQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: AdminOrderStatus })
  @IsOptional()
  @IsEnum(AdminOrderStatus)
  status?: AdminOrderStatus;

  @ApiPropertyOptional({ example: 'Arthur' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminOrdersMetaDto {
  @ApiProperty({ example: 52 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 6 })
  totalPages: number;
}

export class PaginatedAdminOrdersResponseDto {
  @ApiProperty({ type: AdminOrdersMetaDto })
  meta: AdminOrdersMetaDto;

  @ApiProperty({
    type: 'object',
    properties: {
      orders: {
        type: 'array',
        items: { $ref: '#/components/schemas/AdminOrderDto' },
      },
    },
  })
  data: {
    orders: AdminOrderDto[];
  };
}

export class CheckoutOrderItemDto {
  @ApiProperty({ example: 'prod-001' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;
}

export class CheckoutShippingInfoDto {
  @ApiProperty({ example: 'Arthur Pendelton' })
  name: string;

  @ApiProperty({ example: '+44 20 7946 0912' })
  phone: string;

  @ApiProperty({ example: 'London' })
  city: string;

  @ApiProperty({ example: 'Greater London' })
  state: string;

  @ApiProperty({ example: 'NW1 6XE' })
  zipCode: string;

  @ApiProperty({ example: '221B Baker Street, Marylebone' })
  address: string;
}

export class CreateOrderRequestDto {
  @ApiProperty({ type: [CheckoutOrderItemDto] })
  items: CheckoutOrderItemDto[];

  @ApiProperty({ example: 99.98 })
  totalPrice: number;

  @ApiProperty({ example: 10.0 })
  shippingFee: number;

  @ApiProperty({ type: CheckoutShippingInfoDto })
  shippingInfo: CheckoutShippingInfoDto;

  @ApiPropertyOptional({ example: 'Please ring bell upon delivery' })
  @IsOptional()
  @IsString()
  additionalNotes?: string;
}

export class CreateOrderResponsePayloadDto {
  @ApiProperty({ example: 'ord-new-105' })
  orderId: string;

  @ApiProperty({ example: 'https://checkout.stripe.com/c/pay/cs_test_sample' })
  checkoutUrl: string;

  @ApiPropertyOptional({ example: 'https://checkout.stripe.com/c/pay/cs_test_sample' })
  paymentUrl?: string;
}

export class CreateOrderResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Order created successfully' })
  message: string;

  @ApiProperty({ type: CreateOrderResponsePayloadDto })
  data: CreateOrderResponsePayloadDto;
}


