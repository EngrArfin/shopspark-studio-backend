import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ARCHIVED = 'ARCHIVED',
}

export class ProductDto {
  @ApiProperty({ example: 'prd-101', description: 'Unique product ID' })
  id: string;

  @ApiProperty({ example: 'prv-8921', description: 'Provider ID who owns the product' })
  providerId: string;

  @ApiProperty({ example: 'Wireless Noise-Canceling Earbuds Pro', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'wireless-noise-canceling-earbuds-pro', description: 'URL slug' })
  slug: string;

  @ApiProperty({
    example: 'Next-generation earbuds featuring hybrid active noise cancellation, 38-hour battery life, and crystal-clear microphone audio.',
    description: 'Detailed product description',
  })
  description: string;

  @ApiProperty({ example: 89.99, description: 'Selling price' })
  price: number;

  @ApiPropertyOptional({ example: 129.99, description: 'Original MSRP / comparison price' })
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 45.0, description: 'Provider internal cost per item' })
  costPerItem?: number;

  @ApiProperty({ example: 85, description: 'Units currently in stock' })
  stockQuantity: number;

  @ApiProperty({ example: 'SKU-EARBUDS-BLK', description: 'Stock Keeping Unit identifier' })
  sku: string;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  category: string;

  @ApiProperty({
    example: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600',
    ],
    description: 'List of product image URLs',
  })
  images: string[];

  @ApiProperty({ example: ['bluetooth', 'audio', 'earbuds', 'wireless'], description: 'Search and filter tags' })
  tags: string[];

  @ApiProperty({ example: true, description: 'Flag whether this is a featured store product' })
  isFeatured: boolean;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'],
    description: 'Listing status',
  })
  status: ProductStatus;

  @ApiProperty({ example: 4.9, description: 'Average rating' })
  rating: number;

  @ApiProperty({ example: 142, description: 'Total reviews count' })
  reviewsCount: number;

  @ApiProperty({ example: 340, description: 'Total quantity sold' })
  totalSold: number;

  @ApiProperty({ example: '2026-03-10T12:00:00.000Z', description: 'Creation date' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-28T09:30:00.000Z', description: 'Last modified date' })
  updatedAt: string;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductDto], description: 'List of products for current page' })
  data: ProductDto[];

  @ApiProperty({ example: 48, description: 'Total number of matching products' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 5, description: 'Total number of pages available' })
  totalPages: number;
}
