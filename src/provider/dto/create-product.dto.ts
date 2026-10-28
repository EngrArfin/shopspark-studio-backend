import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus } from './product.dto.js';

export class CreateProductDto {
  @ApiProperty({ example: 'Ultra-Fast GaN 100W Wall Charger', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Compact multi-port Gallium Nitride fast charger with 2x USB-C and 1x USB-A ports supporting PD 3.0.',
    description: 'Full product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 49.99, description: 'Product sale price in USD' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 69.99, description: 'Original strike-through comparison price' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 22.5, description: 'Provider internal unit manufacturing/sourcing cost' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerItem?: number;

  @ApiProperty({ example: 120, description: 'Initial stock units available' })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 'SKU-GAN-100W-WHT', description: 'Unique Stock Keeping Unit (SKU)' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Electronics & Accessories', description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
    ],
    description: 'Array of high-resolution product image URLs',
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional({
    example: ['fast-charger', 'gan', 'usb-c', 'power-delivery'],
    description: 'Tags for categorization and search',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: false, description: 'Mark as featured in provider store' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'],
    default: 'ACTIVE',
    description: 'Initial status of the product listing',
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'])
  status?: ProductStatus;
}
