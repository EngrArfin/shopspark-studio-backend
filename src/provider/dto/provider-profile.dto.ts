import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PayoutSettingsDto {
  @ApiPropertyOptional({ example: 'Chase Bank', description: 'Bank institution name' })
  bankName?: string;

  @ApiPropertyOptional({ example: 'ShopSpark Electronics LLC', description: 'Account holder full name' })
  accountHolderName?: string;

  @ApiPropertyOptional({ example: '**** **** 8921', description: 'Bank account number (masked)' })
  accountNumber?: string;

  @ApiPropertyOptional({ example: '021000021', description: 'Bank routing number or sort code' })
  routingNumber?: string;

  @ApiPropertyOptional({ example: '+8801711223344', description: 'Mobile money account (e.g. bKash / Nagad)' })
  mobileMoneyNumber?: string;

  @ApiPropertyOptional({ example: 'finance@shopspark.com', description: 'PayPal account email' })
  paypalEmail?: string;
}

export class ProviderProfileDto {
  @ApiProperty({ example: 'prv-8921', description: 'Provider store profile ID' })
  id: string;

  @ApiProperty({ example: 'usr_f5e3d2c1-b4a0-4567', description: 'Owner User ID' })
  userId: string;

  @ApiProperty({ example: 'Apex Tech Innovations', description: 'Official store name' })
  storeName: string;

  @ApiProperty({ example: 'apex-tech-innovations', description: 'Unique store URL slug' })
  storeSlug: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200',
    description: 'Store logo image URL',
  })
  logoUrl: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    description: 'Store cover banner image URL',
  })
  bannerUrl: string;

  @ApiProperty({
    example: 'Authorized distributor of premium smart devices, audio equipment, and wireless gadgets.',
    description: 'Store bio and description',
  })
  description: string;

  @ApiProperty({ example: '+1 (555) 349-2810', description: 'Public business contact phone' })
  contactPhone: string;

  @ApiProperty({ example: 'support@apextech.store', description: 'Official store contact email' })
  contactEmail: string;

  @ApiProperty({ example: '104 Silicon Valley Way, Suite 300', description: 'Physical store/warehouse address' })
  address: string;

  @ApiProperty({ example: 'San Jose', description: 'Store city' })
  city: string;

  @ApiProperty({ example: 'United States', description: 'Store country' })
  country: string;

  @ApiProperty({ example: 'US-TAX-8932471', description: 'Business tax registration or Trade license number' })
  taxId: string;

  @ApiProperty({ example: 4.88, description: 'Store average seller rating' })
  rating: number;

  @ApiProperty({ example: 342, description: 'Total completed sales count' })
  totalSales: number;

  @ApiProperty({ example: true, description: 'Verified merchant badge status' })
  isVerified: boolean;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'VACATION'],
    description: 'Current merchant account status',
  })
  status: string;

  @ApiProperty({ type: PayoutSettingsDto, description: 'Configured payout destination settings' })
  payoutSettings: PayoutSettingsDto;

  @ApiProperty({ example: '2026-01-15T08:30:00.000Z', description: 'Profile creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-28T10:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: string;
}
