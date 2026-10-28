import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus } from './product.dto.js';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Ultra-Fast GaN 100W Wall Charger (Updated Edition)', description: 'Product title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated specifications with improved thermal management and braided USB-C cable included.',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 45.99, description: 'Updated price in USD' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 59.99, description: 'Updated strike-through comparison price' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 20.0, description: 'Unit cost' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerItem?: number;

  @ApiPropertyOptional({ example: 150, description: 'Updated inventory count' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 'SKU-GAN-100W-V2', description: 'Updated SKU' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 'Electronics & Accessories', description: 'Category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'],
    description: 'Images',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: ['fast-charger', 'gan'], description: 'Tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: true, description: 'Featured state' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'],
    description: 'Listing status',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'])
  status?: ProductStatus;
}

export class UpdateProductStatusDto {
  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'],
    description: 'New product status',
  })
  @IsIn(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'])
  status: ProductStatus;
}
