import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProviderUserSummaryDto {
  @ApiProperty({ example: 'usr-1' })
  id: string;

  @ApiProperty({ example: 'Jean-Luc Dupont' })
  name: string;

  @ApiProperty({ example: 'contact@royalpartydecor.fr' })
  email: string;

  @ApiPropertyOptional({ example: '+33 6 12 34 56 78' })
  phone?: string;

  @ApiProperty({ example: 'PROVIDER' })
  role: string;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: string;
}

export class AdminProviderItemDto {
  @ApiProperty({ example: 'prv-1' })
  id: string;

  @ApiProperty({ example: 'usr-1' })
  userId: string;

  @ApiProperty({ example: 'Royal Party Balloons & Decor' })
  bussinessName: string;

  @ApiProperty({ example: 'Jean-Luc Dupont' })
  contactName: string;

  @ApiProperty({ example: 'contact@royalpartydecor.fr' })
  email: string;

  @ApiProperty({ example: '+33 6 12 34 56 78' })
  phone: string;

  @ApiProperty({ example: ['Decoration', 'Balloons'] })
  serviceCategory: string[];

  @ApiProperty({ example: 'Paris & Île-de-France' })
  serviceArea: string;

  @ApiProperty({ example: 48.8566 })
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  longitude: number;

  @ApiProperty({ example: 4.9 })
  avg_ratting: number;

  @ApiProperty({ example: 28 })
  total_review: number;

  @ApiProperty({ example: 250 })
  price: number;

  @ApiPropertyOptional({ example: 'https://royalpartydecor.fr' })
  website?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/royalpartydecor' })
  instagram?: string;

  @ApiProperty({ example: 'Expert balloon garlands, luxury arches, and customized photo backdrops.' })
  description: string;

  @ApiProperty({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'] })
  portfolioImages: string[];

  @ApiProperty({ example: true })
  isApproved: boolean;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: ProviderUserSummaryDto })
  user: ProviderUserSummaryDto;
}

export class AdminProviderQueryDto {
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

  @ApiPropertyOptional({ example: 'Royal' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '250' })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({ example: 'Decoration' })
  @IsOptional()
  @IsString()
  serviceCategory?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class PaginatedAdminProvidersResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      total: { type: 'number', example: 12 },
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

  @ApiProperty({ type: [AdminProviderItemDto] })
  data: AdminProviderItemDto[];
}

export class ProviderActionResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Provider request updated successfully' })
  message: string;

  @ApiProperty({ type: AdminProviderItemDto })
  data: AdminProviderItemDto;
}

