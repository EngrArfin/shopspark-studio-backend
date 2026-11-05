import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductActivityItemDto {
  @ApiPropertyOptional({ example: 'act-001' })
  id?: string;

  @ApiProperty({ example: 'Wild Safari Origami Crafting' })
  title: string;

  @ApiProperty({ example: 'Children build 3D safari animal models with textured craft papers.' })
  description: string;

  @ApiPropertyOptional({ example: 'prod-001' })
  productId?: string;
}

export class AdminProductItemDto {
  @ApiProperty({ example: 'prod-001' })
  id: string;

  @ApiProperty({ example: 'Safari Adventure Explorer DIY Party Box' })
  title: string;

  @ApiProperty({ example: 'Complete DIY party craft box with animal masks, safari treasure maps, and binoculars.' })
  description: string;

  @ApiProperty({ example: 'DIY_BOX', description: 'DIY_BOX, GIFT, etc.' })
  product_type: string;

  @ApiProperty({ example: '4 - 10 Years' })
  age_range: string;

  @ApiProperty({ example: 49.99 })
  price: number;

  @ApiPropertyOptional({ example: 39.99 })
  discounted_price?: number;

  @ApiProperty({ example: ['10 Animal Masks', 'Treasure Map Scrolls', 'Safari Binoculars', 'Activity Guide'] })
  included: string[];

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=safari-guide' })
  tutorial?: string | null;

  @ApiProperty({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'] })
  imges: string[];

  @ApiProperty({ example: 4.8 })
  avg_rating: number;

  @ApiProperty({ example: 34 })
  total_review: number;

  @ApiProperty({ example: 'Jungle & Safari' })
  theme: string;

  @ApiProperty({ example: 'DIY Boxes' })
  category: string;

  @ApiPropertyOptional({ example: '12 Kids' })
  up_to_kids?: string | null;

  @ApiPropertyOptional({ type: [ProductActivityItemDto] })
  activities?: ProductActivityItemDto[];

  @ApiProperty({ example: '2026-03-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-01T10:00:00.000Z' })
  updatedAt: string;
}

export class CreateAdminProductDto {
  @ApiProperty({ example: 'Safari Adventure Explorer DIY Party Box' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Complete DIY party craft box with animal masks and binoculars.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'DIY_BOX' })
  @IsNotEmpty()
  @IsString()
  product_type: string;

  @ApiProperty({ example: 'Jungle & Safari' })
  @IsNotEmpty()
  @IsString()
  theme: string;

  @ApiProperty({ example: 'DIY Boxes' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: '4 - 10 Years' })
  @IsNotEmpty()
  @IsString()
  age_range: string;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 39.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discounted_price?: number;

  @ApiPropertyOptional({ example: ['10 Animal Masks', 'Activity Guide'] })
  @IsOptional()
  @IsArray()
  included?: string[];

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'] })
  @IsOptional()
  @IsArray()
  imges?: string[];

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=safari-guide' })
  @IsOptional()
  @IsString()
  tutorial?: string;

  @ApiPropertyOptional({ example: '12 Kids' })
  @IsOptional()
  @IsString()
  up_to_kids?: string;

  @ApiPropertyOptional({ type: [ProductActivityItemDto] })
  @IsOptional()
  @IsArray()
  activities?: ProductActivityItemDto[];
}

export class UpdateAdminProductDto {
  @ApiPropertyOptional({ example: 'Updated Safari Adventure Explorer DIY Party Box' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'DIY_BOX' })
  @IsOptional()
  @IsString()
  product_type?: string;

  @ApiPropertyOptional({ example: 'Jungle & Safari' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ example: 'DIY Boxes' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '4 - 10 Years' })
  @IsOptional()
  @IsString()
  age_range?: string;

  @ApiPropertyOptional({ example: 49.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 39.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discounted_price?: number;

  @ApiPropertyOptional({ example: ['10 Animal Masks'] })
  @IsOptional()
  @IsArray()
  included?: string[];

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d'] })
  @IsOptional()
  @IsArray()
  imges?: string[];

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=safari-guide' })
  @IsOptional()
  @IsString()
  tutorial?: string;

  @ApiPropertyOptional({ example: '12 Kids' })
  @IsOptional()
  @IsString()
  up_to_kids?: string;
}

export class ProductsCatalogGroupsDto {
  @ApiProperty({ type: [AdminProductItemDto] })
  diyBoxes: AdminProductItemDto[];

  @ApiProperty({ type: [AdminProductItemDto] })
  gifts: AdminProductItemDto[];
}

export class ProductsApiResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Products retrieved successfully' })
  message: string;

  @ApiProperty({ type: ProductsCatalogGroupsDto })
  data: ProductsCatalogGroupsDto;

  @ApiProperty({ type: [AdminProductItemDto] })
  all: AdminProductItemDto[];
}

export class SingleProductApiResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Product retrieved successfully' })
  message: string;

  @ApiProperty({ type: AdminProductItemDto })
  data: AdminProductItemDto;
}

