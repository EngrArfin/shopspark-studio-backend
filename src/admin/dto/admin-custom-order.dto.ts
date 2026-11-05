import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomOrderItemDto {
  @ApiProperty({ example: 'co-1' })
  id: string;

  @ApiProperty({ example: 'Arthur Pendelton' })
  customerName: string;

  @ApiProperty({ example: 'arthur.pendelton@example.com' })
  customerEmail: string;

  @ApiProperty({ example: 'Crew Neck Cotton' })
  tShirtType: string;

  @ApiProperty({ example: 'S (4), M (6), L (2)' })
  size: string;

  @ApiProperty({ example: 12 })
  quantity: number;

  @ApiProperty({ example: 360 })
  total: number | string;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED'] })
  status: string;

  @ApiPropertyOptional({ example: 'Galaxy Retro Wave' })
  theme?: string;

  @ApiPropertyOptional({ example: '221B Baker Street, Marylebone' })
  address?: string;

  @ApiPropertyOptional({ example: 'London' })
  city?: string;

  @ApiPropertyOptional({ example: 'Greater London' })
  state?: string;

  @ApiPropertyOptional({ example: 'NW1 6XE' })
  zipCode?: string;

  @ApiPropertyOptional({ example: '+44 20 7946 0912' })
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Please ensure high-resolution print on the front and sleeve.' })
  optionalMessage?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' })
  mockupUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' })
  designUrl?: string;

  @ApiProperty({ example: '2026-10-20T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-20T10:30:00.000Z' })
  updatedAt: string;
}

export class UpdateCustomOrderStatusDto {
  @ApiProperty({ example: 'IN_PRODUCTION' })
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class CustomOrderQueryDto {
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

  @ApiPropertyOptional({ example: 'PENDING' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Arthur' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedCustomOrdersResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number', example: 18 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      totalPages: { type: 'number', example: 2 },
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty({
    type: 'object',
    properties: {
      orders: {
        type: 'array',
        items: { $ref: '#/components/schemas/CustomOrderItemDto' },
      },
    },
  })
  data: {
    orders: CustomOrderItemDto[];
  };
}

export class CreateCustomOrderRequestDto {
  @ApiProperty({ example: 'Arthur Pendelton' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'arthur.pendelton@example.com' })
  @IsNotEmpty()
  @IsString()
  customerEmail: string;

  @ApiProperty({ example: 'Crew Neck Cotton' })
  @IsNotEmpty()
  @IsString()
  tShirtType: string;

  @ApiProperty({ example: 'S (4), M (6), L (2)' })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ example: 360 })
  @IsOptional()
  total?: number;

  @ApiPropertyOptional({ example: 'Galaxy Retro Wave' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ example: '221B Baker Street, Marylebone' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+44 20 7946 0912' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'High resolution print on chest and left sleeve' })
  @IsOptional()
  @IsString()
  optionalMessage?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' })
  @IsOptional()
  @IsString()
  mockupUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' })
  @IsOptional()
  @IsString()
  designUrl?: string;
}

export class CreateCustomOrderResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Custom order created successfully' })
  message: string;

  @ApiProperty({ type: CustomOrderItemDto })
  data: CustomOrderItemDto;
}


