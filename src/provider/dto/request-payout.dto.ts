import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { PayoutHistoryItemDto } from './payout.dto.js';

export class RequestPayoutDto {
  @ApiProperty({ example: 500.0, description: 'Amount to withdraw (must be at least minimumPayoutAmount)' })
  @IsNumber()
  @IsPositive()
  @Min(50)
  amount: number;

  @ApiProperty({
    example: 'BANK_TRANSFER',
    enum: ['BANK_TRANSFER', 'BKASH', 'NAGAD', 'PAYPAL'],
    description: 'Selected payout transfer channel',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    example: 'Chase Bank - Acct: 123456789, Routing: 021000021',
    description: 'Target bank or account recipient information',
  })
  @IsString()
  @IsNotEmpty()
  accountDetails: string;

  @ApiPropertyOptional({ example: 'End of month revenue withdrawal', description: 'Optional provider reference note' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class RequestPayoutResponseDto {
  @ApiProperty({ example: true, description: 'Operation success flag' })
  success: boolean;

  @ApiProperty({ example: 'Payout request of $500.00 submitted successfully', description: 'Status message' })
  message: string;

  @ApiProperty({ type: PayoutHistoryItemDto, description: 'Created payout transaction record' })
  payout: PayoutHistoryItemDto;
}
