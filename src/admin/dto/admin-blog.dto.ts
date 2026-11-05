import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminBlogDto {
  @ApiProperty({ example: 'blog-1' })
  id: string;

  @ApiProperty({ example: 'Top 10 Kids Birthday Party Themes for 2026' })
  title: string;

  @ApiProperty({ example: 'Discover the most thrilling themes captivating children this year from space exploration to retro arcade.' })
  description: string;

  @ApiProperty({ example: 'Careful planning, themed DIY boxes, and engaging games ensure lasting childhood memories.' })
  conclusion: string;

  @ApiProperty({ example: 'Trending' })
  badge: string;

  @ApiProperty({ example: ['Birthday', 'Decorations', 'Party Planning'] })
  tag: string[];

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'] })
  images?: string[];

  @ApiPropertyOptional({ example: 'usr-admin-1' })
  user_id?: string;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: '2026-10-15T10:00:00.000Z' })
  updatedAt?: string;
}

export class CreateAdminBlogDto {
  @ApiProperty({ example: 'Top 10 Kids Birthday Party Themes for 2026' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Discover the most thrilling themes captivating children this year.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Careful planning ensures lasting memories.' })
  @IsNotEmpty()
  @IsString()
  conclusion: string;

  @ApiProperty({ example: 'Trending' })
  @IsNotEmpty()
  @IsString()
  badge: string;

  @ApiProperty({ example: ['Birthday', 'Decorations'] })
  @IsArray()
  tag: string[];

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'] })
  @IsOptional()
  @IsArray()
  images?: string[];
}

export class UpdateAdminBlogDto {
  @ApiPropertyOptional({ example: 'Top 10 Kids Birthday Party Themes (Updated)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Updated conclusion' })
  @IsOptional()
  @IsString()
  conclusion?: string;

  @ApiPropertyOptional({ example: 'Featured' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ example: ['Birthday', 'Trends'] })
  @IsOptional()
  @IsArray()
  tag?: string[];

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d'] })
  @IsOptional()
  @IsArray()
  images?: string[];
}

export class BlogsApiResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Blogs retrieved successfully' })
  message: string;

  @ApiProperty({ type: [AdminBlogDto] })
  data: AdminBlogDto[];
}

export class SingleBlogApiResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Blog retrieved successfully' })
  message: string;

  @ApiProperty({ type: AdminBlogDto })
  data: AdminBlogDto;
}

