import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AdminAffiliatedProductDto {
  @ApiProperty({ example: 'aff-01' })
  id: string;

  @ApiProperty({ example: 'Sparkle Party Glow Sticks Mega Pack' })
  title: string;

  @ApiProperty({ example: 24.99 })
  price: number;

  @ApiProperty({ example: 4.7 })
  avgRating: number;

  @ApiProperty({ example: 128 })
  totalRatings: number;

  @ApiProperty({ example: '3+ Years' })
  ageRange: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' })
  imageUrl: string;

  @ApiProperty({ example: 'GlowMagic Party Ltd' })
  company: string;

  @ApiProperty({ example: 'https://amazon.com/dp/B07XYZ1234?tag=shopspark-20' })
  productLink: string;

  @ApiProperty({ example: '2026-04-10T10:00:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: '2026-04-10T10:00:00.000Z' })
  updatedAt?: string;
}

export class CreateAffiliatedProductDto {
  @ApiProperty({ example: 'Sparkle Party Glow Sticks Mega Pack' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 24.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 4.7, default: 5.0 })
  @IsOptional()
  @IsNumber()
  avgRating?: number;

  @ApiPropertyOptional({ example: 128, default: 0 })
  @IsOptional()
  @IsNumber()
  totalRatings?: number;

  @ApiProperty({ example: '3+ Years' })
  @IsNotEmpty()
  @IsString()
  ageRange: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 'GlowMagic Party Ltd' })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({ example: 'https://amazon.com/dp/B07XYZ1234?tag=shopspark-20' })
  @IsNotEmpty()
  @IsString()
  productLink: string;
}

export class UpdateAffiliatedProductDto {
  @ApiPropertyOptional({ example: 'Updated Sparkle Party Glow Sticks' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 21.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: '4+ Years' })
  @IsOptional()
  @IsString()
  ageRange?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'GlowMagic Prime' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'https://amazon.com/dp/B07XYZ1234' })
  @IsOptional()
  @IsString()
  productLink?: string;
}

export class AffiliatedProductsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [AdminAffiliatedProductDto] })
  data: AdminAffiliatedProductDto[];
}

export class SingleAffiliatedProductResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: AdminAffiliatedProductDto })
  data: AdminAffiliatedProductDto;
}

