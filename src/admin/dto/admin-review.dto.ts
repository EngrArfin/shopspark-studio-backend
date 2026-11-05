import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AdminReviewDto {
  @ApiProperty({ example: 'rev-1' })
  id: string;

  @ApiProperty({ example: 'Camille & Julien Laurent' })
  name: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' })
  imageUrl?: string;

  @ApiProperty({ example: 'The Safari Explorer DIY box made our son’s 7th birthday unforgettable! Every single kid was thoroughly engaged crafting their animal masks.' })
  review: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Happy Parents', enum: ['USER', 'PROVIDER', 'Happy Parents'] })
  type: string;

  @ApiProperty({ example: 'Active', enum: ['Active', 'Inactive'] })
  status: string;

  @ApiProperty({ example: '2026-10-14T16:45:00.000Z' })
  createdAt: string;
}

export class CreateAdminReviewDto {
  @ApiProperty({ example: 'Camille & Julien Laurent' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'The Safari Explorer DIY box made our son’s 7th birthday unforgettable!' })
  @IsNotEmpty()
  @IsString()
  review: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Happy Parents', enum: ['USER', 'PROVIDER', 'Happy Parents'] })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Active', enum: ['Active', 'Inactive'] })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateAdminReviewDto {
  @ApiPropertyOptional({ example: 'Active', enum: ['Active', 'Inactive'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Updated review text...' })
  @IsOptional()
  @IsString()
  review?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  rating?: number;
}

export class ReviewsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [AdminReviewDto] })
  data: AdminReviewDto[];
}

