import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PlanFormDataDto {
  @ApiProperty({ example: 'Pro Vendor Membership' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 49.0 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'MONTHLY', enum: ['MONTHLY', 'YEARLY'] })
  @IsNotEmpty()
  @IsString()
  interval: string;

  @ApiProperty({ example: 'Includes unlimited quote bids, verified badge, and priority client matching' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: ['Unlimited Bids', 'Verified Vendor Badge', 'Direct Customer Chat', 'Priority Placement'] })
  @IsArray()
  features: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isPopular?: boolean;
}

export class PlanDto {
  @ApiProperty({ example: 'plan-pro-01' })
  id: string;

  @ApiProperty({ example: 'Pro Vendor Membership' })
  name: string;

  @ApiProperty({ example: 49.0 })
  price: number;

  @ApiProperty({ example: 'MONTHLY' })
  interval: string;

  @ApiProperty({ example: 'Includes unlimited quote bids and priority client matching' })
  description: string;

  @ApiProperty({ example: ['Unlimited Bids', 'Verified Vendor Badge', 'Direct Customer Chat'] })
  features: string[];

  @ApiProperty({ example: true })
  isPopular: boolean;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  updatedAt: string;
}

export class GetPlansResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [PlanDto] })
  data: PlanDto[];
}

