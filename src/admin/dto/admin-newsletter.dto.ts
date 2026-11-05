import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewsletterSubscriberDto {
  @ApiProperty({ example: 'sub-1' })
  id: string;

  @ApiProperty({ example: 1 })
  no: number;

  @ApiProperty({ example: 'clara.dupont@example.fr' })
  email: string;

  @ApiProperty({ example: '2026-10-18T09:15:00.000Z' })
  subscribedAt: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'UNSUBSCRIBED'] })
  status: string;
}

export class CreateNewsletterSubscriberDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class SendNewsletterCampaignDto {
  @ApiProperty({ example: 'Special Spring Party Promotion - 20% OFF DIY Kits!' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Check out our new party boxes for birthdays and special celebrations...' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'ALL_SUBSCRIBERS' })
  @IsOptional()
  @IsString()
  targetAudience?: string;
}

export class NewsletterResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [NewsletterSubscriberDto] })
  data: NewsletterSubscriberDto[];
}

