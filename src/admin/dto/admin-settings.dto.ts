import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SystemDefaultsDto {
  @ApiProperty({ example: 'Europe/Paris' })
  timezone: string;

  @ApiProperty({ example: 'EUR (€)' })
  currency: string;

  @ApiProperty({ example: 10.0, description: 'Platform commission fee in percentage' })
  platformFeePercentage: number;

  @ApiProperty({ example: false, description: 'Platform maintenance mode flag' })
  maintenanceMode: boolean;

  @ApiProperty({ example: 'support@shopspark.com' })
  supportEmail: string;

  @ApiProperty({ example: 50.0, description: 'Minimum payout withdrawal threshold in EUR' })
  minPayoutThreshold: number;

  @ApiProperty({ example: 'Auto-confirm orders within 24 hours' })
  orderPolicy: string;
}

export class UpdateSystemDefaultsDto {
  @ApiPropertyOptional({ example: 'Europe/Paris' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'EUR (€)' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 12.0 })
  @IsOptional()
  @IsNumber()
  platformFeePercentage?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @ApiPropertyOptional({ example: 'support@shopspark.com' })
  @IsOptional()
  @IsString()
  supportEmail?: string;

  @ApiPropertyOptional({ example: 50.0 })
  @IsOptional()
  @IsNumber()
  minPayoutThreshold?: number;

  @ApiPropertyOptional({ example: 'Updated policy' })
  @IsOptional()
  @IsString()
  orderPolicy?: string;
}

export class AuditLogItemDto {
  @ApiProperty({ example: 'log-1' })
  id: string;

  @ApiProperty({ example: 'Updated provider commission policy & threshold settings' })
  action: string;

  @ApiProperty({ example: '2026-10-23 18:45:10' })
  timestamp: string;

  @ApiProperty({ example: 'Super Admin (Alexandre)' })
  admin: string;

  @ApiPropertyOptional({ example: 'POLICY' })
  category?: string;
}

export class SystemSettingsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: SystemDefaultsDto })
  data: SystemDefaultsDto;
}

export class AuditLogsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [AuditLogItemDto] })
  data: AuditLogItemDto[];
}

