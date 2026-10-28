import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @ApiProperty({ example: 'rev-501', description: 'Review ID' })
  id: string;

  @ApiProperty({ example: 'prd-101', description: 'Associated Product ID' })
  productId: string;

  @ApiProperty({ example: 'Wireless Noise-Canceling Earbuds Pro', description: 'Product title' })
  productTitle: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
    description: 'Product thumbnail image',
  })
  productImageUrl: string;

  @ApiProperty({ example: 'Michael Brown', description: 'Customer name' })
  customerName: string;

  @ApiProperty({ example: 5, description: 'Star rating (1 to 5)' })
  rating: number;

  @ApiProperty({
    example: 'Outstanding sound quality and the noise cancellation works like magic during flights!',
    description: 'Customer review comment',
  })
  comment: string;

  @ApiPropertyOptional({
    example: 'Thank you Michael! We are glad you love the earbuds and appreciate your support!',
    description: 'Provider store response/reply',
  })
  providerReply?: string;

  @ApiPropertyOptional({
    example: '2026-10-27T14:20:00.000Z',
    description: 'Timestamp when provider replied',
  })
  repliedAt?: string;

  @ApiProperty({ example: '2026-10-26T18:45:00.000Z', description: 'Review submission timestamp' })
  createdAt: string;
}

export class ReviewQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 5, description: 'Filter by exact star rating (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 'prd-101', description: 'Filter by specific product ID' })
  @IsOptional()
  @IsString()
  productId?: string;
}

export class PaginatedReviewsResponseDto {
  @ApiProperty({ type: [ReviewDto], description: 'List of reviews' })
  data: ReviewDto[];

  @ApiProperty({ example: 198, description: 'Total review count' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Page limit' })
  limit: number;

  @ApiProperty({ example: 20, description: 'Total pages available' })
  totalPages: number;
}
