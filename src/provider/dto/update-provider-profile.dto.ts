import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PayoutSettingsDto } from './provider-profile.dto.js';

export class UpdateProviderProfileDto {
  @ApiPropertyOptional({ example: 'Apex Tech Innovations', description: 'Store name' })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiPropertyOptional({
    example: 'Authorized distributor of premium smart devices, audio equipment, and wireless gadgets.',
    description: 'Store description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200',
    description: 'Logo image URL',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    description: 'Cover banner image URL',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ example: '+1 (555) 349-2810', description: 'Contact phone' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'support@apextech.store', description: 'Store email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '104 Silicon Valley Way, Suite 300', description: 'Store address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'San Jose', description: 'Store city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'United States', description: 'Store country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'US-TAX-8932471', description: 'Tax ID or business license' })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ type: PayoutSettingsDto, description: 'Updated payout payment settings' })
  @IsOptional()
  @ValidateNested()
  @Type(() => PayoutSettingsDto)
  payoutSettings?: PayoutSettingsDto;
}
