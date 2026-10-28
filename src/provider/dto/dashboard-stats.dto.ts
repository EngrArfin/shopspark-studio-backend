import { ApiProperty } from '@nestjs/swagger';

export class SalesAnalyticsPointDto {
  @ApiProperty({ example: 'Mon', description: 'Period label (day or month)' })
  label: string;

  @ApiProperty({ example: 4250.0, description: 'Revenue generated in this period' })
  revenue: number;

  @ApiProperty({ example: 14, description: 'Number of orders in this period' })
  orders: number;
}

export class OrderStatusDistributionDto {
  @ApiProperty({ example: 7, description: 'Count of pending orders' })
  pending: number;

  @ApiProperty({ example: 12, description: 'Count of orders currently processing' })
  processing: number;

  @ApiProperty({ example: 25, description: 'Count of shipped orders' })
  shipped: number;

  @ApiProperty({ example: 295, description: 'Count of successfully delivered orders' })
  delivered: number;

  @ApiProperty({ example: 3, description: 'Count of cancelled orders' })
  cancelled: number;
}

export class TopSellingProductDto {
  @ApiProperty({ example: 'prd-101', description: 'Product ID' })
  id: string;

  @ApiProperty({ example: 'Wireless Noise-Canceling Earbuds Pro', description: 'Product name' })
  title: string;

  @ApiProperty({ example: 89.99, description: 'Current selling price' })
  price: number;

  @ApiProperty({ example: 142, description: 'Total units sold' })
  soldCount: number;

  @ApiProperty({ example: 12778.58, description: 'Total gross revenue generated' })
  revenue: number;

  @ApiProperty({ example: 4.9, description: 'Average customer rating' })
  rating: number;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    description: 'Product primary thumbnail URL',
  })
  imageUrl: string;
}

export class RecentOrderSummaryDto {
  @ApiProperty({ example: 'ord-8910', description: 'Unique order identifier' })
  id: string;

  @ApiProperty({ example: 'ORD-2026-8910', description: 'Display order number' })
  orderNumber: string;

  @ApiProperty({ example: 'Sarah Jenkins', description: 'Customer full name' })
  customerName: string;

  @ApiProperty({ example: 189.98, description: 'Total order amount' })
  totalAmount: number;

  @ApiProperty({
    example: 'PROCESSING',
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    description: 'Current order fulfillment status',
  })
  status: string;

  @ApiProperty({
    example: 'PAID',
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    description: 'Payment status',
  })
  paymentStatus: string;

  @ApiProperty({ example: 2, description: 'Number of item types in order' })
  itemsCount: number;

  @ApiProperty({ example: '2026-10-28T10:15:00.000Z', description: 'Order creation timestamp' })
  createdAt: string;
}

export class DashboardMetricsDto {
  @ApiProperty({ example: 28450.75, description: 'Total gross revenue in USD' })
  totalRevenue: number;

  @ApiProperty({ example: 18.4, description: 'Revenue growth percentage vs last month' })
  revenueGrowth: number;

  @ApiProperty({ example: 342, description: 'Total orders received to date' })
  totalOrders: number;

  @ApiProperty({ example: 12.8, description: 'Orders growth percentage vs last month' })
  ordersGrowth: number;

  @ApiProperty({ example: 48, description: 'Total active products listed by provider' })
  totalProducts: number;

  @ApiProperty({ example: 4, description: 'Products that have low inventory (stock <= 5)' })
  lowStockCount: number;

  @ApiProperty({ example: 4.85, description: 'Average customer store rating (out of 5.0)' })
  averageRating: number;

  @ApiProperty({ example: 198, description: 'Total customer reviews received' })
  totalReviews: number;

  @ApiProperty({ example: 7, description: 'Orders awaiting provider fulfillment' })
  pendingOrders: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({ type: DashboardMetricsDto, description: 'Key performance indicators' })
  metrics: DashboardMetricsDto;

  @ApiProperty({
    type: [SalesAnalyticsPointDto],
    description: 'Sales and revenue chart data points for the selected period',
  })
  salesAnalytics: SalesAnalyticsPointDto[];

  @ApiProperty({
    type: OrderStatusDistributionDto,
    description: 'Distribution breakdown of orders across different statuses',
  })
  orderStatusDistribution: OrderStatusDistributionDto;

  @ApiProperty({
    type: [TopSellingProductDto],
    description: 'Top performing products by sales volume and revenue',
  })
  topProducts: TopSellingProductDto[];

  @ApiProperty({
    type: [RecentOrderSummaryDto],
    description: 'Recent orders requiring attention or review',
  })
  recentOrders: RecentOrderSummaryDto[];
}
