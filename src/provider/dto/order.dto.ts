import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class OrderCustomerDto {
  @ApiProperty({ example: 'usr_c8192a0', description: 'Customer ID' })
  id: string;

  @ApiProperty({ example: 'Sarah Jenkins', description: 'Customer full name' })
  name: string;

  @ApiProperty({ example: 'sarah.jenkins@example.com', description: 'Customer email' })
  email: string;

  @ApiProperty({ example: '+1 (555) 234-5678', description: 'Customer phone number' })
  phone: string;
}

export class ShippingAddressDto {
  @ApiProperty({ example: '742 Evergreen Terrace', description: 'Street address' })
  street: string;

  @ApiProperty({ example: 'Springfield', description: 'City' })
  city: string;

  @ApiProperty({ example: 'Oregon', description: 'State or Province' })
  state: string;

  @ApiProperty({ example: '97477', description: 'Postal / ZIP Code' })
  postalCode: string;

  @ApiProperty({ example: 'United States', description: 'Country' })
  country: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'itm-301', description: 'Order Item ID' })
  id: string;

  @ApiProperty({ example: 'prd-101', description: 'Product ID' })
  productId: string;

  @ApiProperty({ example: 'Wireless Noise-Canceling Earbuds Pro', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'SKU-EARBUDS-BLK', description: 'Product SKU' })
  sku: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
    description: 'Product thumbnail image',
  })
  imageUrl: string;

  @ApiProperty({ example: 89.99, description: 'Price per unit at order time' })
  unitPrice: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ example: 179.98, description: 'Line item subtotal' })
  subtotal: number;
}

export class OrderTimelineEventDto {
  @ApiProperty({ example: 'PROCESSING', description: 'Status state at event' })
  status: string;

  @ApiProperty({ example: 'Order packed and prepared for pickup by FedEx', description: 'Event detail note' })
  note: string;

  @ApiProperty({ example: '2026-10-28T11:20:00.000Z', description: 'Event timestamp' })
  timestamp: string;
}

export class OrderDto {
  @ApiProperty({ example: 'ord-8910', description: 'Order ID' })
  id: string;

  @ApiProperty({ example: 'ORD-2026-8910', description: 'Human-readable order reference number' })
  orderNumber: string;

  @ApiProperty({ example: 'prv-8921', description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ type: OrderCustomerDto, description: 'Customer details' })
  customer: OrderCustomerDto;

  @ApiProperty({ type: ShippingAddressDto, description: 'Delivery destination' })
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ type: [OrderItemDto], description: 'Items in this provider order' })
  items: OrderItemDto[];

  @ApiProperty({ example: 179.98, description: 'Items subtotal' })
  subtotal: number;

  @ApiProperty({ example: 10.0, description: 'Shipping charge' })
  shippingFee: number;

  @ApiProperty({ example: 0.0, description: 'Discount applied' })
  discount: number;

  @ApiProperty({ example: 189.98, description: 'Grand total payable' })
  totalAmount: number;

  @ApiProperty({
    example: 'PROCESSING',
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    description: 'Fulfillment status',
  })
  status: OrderStatus;

  @ApiProperty({
    example: 'PAID',
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    description: 'Payment status',
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({ example: 'CREDIT_CARD', description: 'Payment method utilized' })
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'FDX-99823411', description: 'Courier tracking code' })
  trackingNumber?: string;

  @ApiPropertyOptional({ example: 'FedEx Express', description: 'Shipping carrier service' })
  carrier?: string;

  @ApiPropertyOptional({ example: 'Please leave package at the front porch.', description: 'Customer notes' })
  customerNotes?: string;

  @ApiProperty({ type: [OrderTimelineEventDto], description: 'Status progression history' })
  timeline: OrderTimelineEventDto[];

  @ApiProperty({ example: '2026-10-28T10:15:00.000Z', description: 'Order placement timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-28T11:20:00.000Z', description: 'Last update timestamp' })
  updatedAt: string;
}

export class PaginatedOrdersResponseDto {
  @ApiProperty({ type: [OrderDto], description: 'List of orders for page' })
  data: OrderDto[];

  @ApiProperty({ example: 342, description: 'Total orders matching query' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Page limit' })
  limit: number;

  @ApiProperty({ example: 35, description: 'Total available pages' })
  totalPages: number;
}
