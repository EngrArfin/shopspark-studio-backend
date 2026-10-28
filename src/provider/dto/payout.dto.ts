import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class PayoutSummaryDto {
  @ApiProperty({ example: 28450.75, description: 'Total gross lifetime earnings' })
  totalEarnings: number;

  @ApiProperty({ example: 4850.5, description: 'Balance currently cleared and available for immediate withdrawal' })
  availableBalance: number;

  @ApiProperty({ example: 1250.0, description: 'Balance held for pending order clearances' })
  pendingBalance: number;

  @ApiProperty({ example: 22350.25, description: 'Total amount successfully withdrawn to date' })
  withdrawnTotal: number;

  @ApiProperty({ example: 50.0, description: 'Minimum allowed withdrawal threshold' })
  minimumPayoutAmount: number;

  @ApiProperty({ example: 'USD', description: 'Currency unit' })
  currency: string;
}

export class PayoutHistoryItemDto {
  @ApiProperty({ example: 'pay-7701', description: 'Unique payout transaction ID' })
  id: string;

  @ApiProperty({ example: 'PO-2026-7701', description: 'Payout reference identifier' })
  referenceNumber: string;

  @ApiProperty({ example: 1500.0, description: 'Requested payout amount' })
  amount: number;

  @ApiProperty({ example: 'USD', description: 'Payout currency' })
  currency: string;

  @ApiProperty({
    example: 'COMPLETED',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'],
    description: 'Current status of withdrawal',
  })
  status: PayoutStatus;

  @ApiProperty({ example: 'BANK_TRANSFER', description: 'Transfer method' })
  paymentMethod: string;

  @ApiProperty({ example: 'Chase Bank (**** 8921)', description: 'Target destination details' })
  destinationAccount: string;

  @ApiPropertyOptional({ example: 'Monthly seller revenue payout', description: 'Transaction memo or note' })
  note?: string;

  @ApiProperty({ example: '2026-10-15T09:30:00.000Z', description: 'Request timestamp' })
  requestedAt: string;

  @ApiPropertyOptional({ example: '2026-10-16T14:10:00.000Z', description: 'Completion timestamp' })
  processedAt?: string;
}

export class PayoutHistoryResponseDto {
  @ApiProperty({ type: [PayoutHistoryItemDto], description: 'List of past payouts' })
  payouts: PayoutHistoryItemDto[];

  @ApiProperty({ example: 8, description: 'Total payout count' })
  total: number;
}
