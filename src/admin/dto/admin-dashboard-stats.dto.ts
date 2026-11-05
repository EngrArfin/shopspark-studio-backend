import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MonthlyRevenueDataPointDto {
  @ApiProperty({ example: 'Jan', description: 'Month label' })
  month: string;

  @ApiProperty({ example: 28000, description: 'Total revenue in EUR' })
  revenue: number;

  @ApiProperty({ example: 120, description: 'Total orders placed in this month' })
  orders: number;
}

export class OrderStatusCountMapDto {
  @ApiProperty({ example: 14 })
  PENDING: number;

  @ApiProperty({ example: 28 })
  CONFIRMED: number;

  @ApiProperty({ example: 19 })
  PROCESSING: number;

  @ApiProperty({ example: 35 })
  SHIPPED: number;

  @ApiProperty({ example: 142 })
  DELIVERED: number;

  @ApiProperty({ example: 6 })
  CANCELLED: number;
}

export class RecentOrderSummaryItemDto {
  @ApiProperty({ example: 'ord-101' })
  id: string;

  @ApiProperty({ example: 'ORD-2026-9841' })
  orderNumber: string;

  @ApiProperty({ example: 'Jean-Luc Dupont' })
  customerName: string;

  @ApiProperty({ example: 'contact@royalpartydecor.fr' })
  customerEmail: string;

  @ApiProperty({ example: 380 })
  totalAmount: number;

  @ApiProperty({ example: 'CONFIRMED' })
  status: string;

  @ApiProperty({ example: 'PAID' })
  paymentStatus: string;

  @ApiProperty({ example: '2026-10-24T14:30:00.000Z' })
  createdAt: string;
}

export class TopProviderItemDto {
  @ApiProperty({ example: 'prv-1' })
  id: string;

  @ApiProperty({ example: 'Royal Party Balloons & Decor' })
  bussinessName: string;

  @ApiProperty({ example: 4.9 })
  avg_ratting: number;

  @ApiProperty({ example: 28 })
  total_review: number;

  @ApiProperty({ example: 14250 })
  totalSales: number;

  @ApiProperty({ example: true })
  isApproved: boolean;
}

export class AdminDashboardOverviewDto {
  @ApiProperty({ example: 1420, description: 'Total registered users in platform' })
  totalUsers: number;

  @ApiProperty({ example: 68, description: 'Total catalog products available' })
  totalProducts: number;

  @ApiProperty({ example: 186, description: 'Total verified active providers' })
  totalProviders: number;

  @ApiProperty({ example: 42850, description: 'Total platform gross revenue' })
  totalRevenue: number;

  @ApiProperty({ example: 10.5, description: 'Percentage user growth vs last month' })
  userGrowthPercentage: number;

  @ApiProperty({ example: -5.2, description: 'Percentage product catalog growth' })
  productGrowthPercentage: number;

  @ApiProperty({ example: 12.0, description: 'Percentage provider onboarding growth' })
  providerGrowthPercentage: number;

  @ApiProperty({ example: 20.4, description: 'Percentage revenue growth vs last month' })
  revenueGrowthPercentage: number;

  @ApiProperty({ type: [MonthlyRevenueDataPointDto], description: 'Monthly revenue trend points' })
  monthlyRevenue: MonthlyRevenueDataPointDto[];

  @ApiProperty({ type: OrderStatusCountMapDto, description: 'Distribution of orders by status' })
  orderStatusCounts: OrderStatusCountMapDto;

  @ApiProperty({ type: [RecentOrderSummaryItemDto], description: 'Recent orders for admin feed' })
  recentOrders: RecentOrderSummaryItemDto[];

  @ApiProperty({ type: [TopProviderItemDto], description: 'Top performing vendor providers' })
  topProviders: TopProviderItemDto[];
}

export class AdminOverviewResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Admin dashboard overview retrieved successfully' })
  message: string;

  @ApiProperty({ type: AdminDashboardOverviewDto })
  data: AdminDashboardOverviewDto;
}

export class StateDataDto {
  @ApiProperty({ example: 1420 })
  totalUsers: number;

  @ApiProperty({ example: 324 })
  totalPartyPlans: number;

  @ApiProperty({ example: 890 })
  totalBookings: number;

  @ApiProperty({ example: 244 })
  totalOrders: number;
}

export class AdminStatsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: StateDataDto })
  data: StateDataDto;
}

