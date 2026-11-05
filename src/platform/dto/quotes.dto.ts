import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class QuoteItemDto {
  @ApiProperty({ example: 'Safari Adventure Party Decor' })
  title: string;

  @ApiProperty({ example: 250 })
  price: number;
}

export class QuoteRequestDto {
  @ApiProperty({ example: 'prv-1' })
  @IsNotEmpty()
  @IsString()
  providerId: string;

  @ApiProperty({ example: '2026-11-20' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: '14:00' })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({ example: 'Paris 75001' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  guestCount: number;

  @ApiPropertyOptional({ example: 'Need blue and gold balloon garlands' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QuoteResponseDto {
  @ApiProperty({ example: 'quote-101' })
  id: string;

  @ApiProperty({ example: 'prv-1' })
  providerId: string;

  @ApiProperty({ example: 'usr-2' })
  userId: string;

  @ApiProperty({ example: 'Royal Party Balloons & Decor' })
  providerName: string;

  @ApiProperty({ example: 250 })
  totalPrice: number;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'BOOKED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ example: '2026-11-20' })
  date: string;

  @ApiProperty({ example: 'Paris 75001' })
  location: string;

  @ApiProperty({ example: '2026-10-24T12:00:00.000Z' })
  createdAt: string;
}

export class UpdateQuoteStatusDto {
  @ApiProperty({ example: 'BOOKED', enum: ['BOOKED', 'CANCELLED'] })
  @IsNotEmpty()
  @IsString()
  status: 'BOOKED' | 'CANCELLED';
}

