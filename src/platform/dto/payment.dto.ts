import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutPaymentRequestDto {
  @ApiProperty({ example: 'quote-101' })
  @IsNotEmpty()
  @IsString()
  quoteId: string;
}

export class CheckoutPaymentResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      url: { type: 'string', example: 'https://checkout.stripe.com/c/pay/cs_test_mock_12345' },
    },
  })
  data: {
    url: string;
  };
}

export class OnboardingLinkResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      url: { type: 'string', example: 'https://connect.stripe.com/setup/s/acct_test_mock' },
    },
  })
  data: {
    url: string;
  };
}

export class OnboardingStatusResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      charges_enabled: { type: 'boolean', example: true },
      payouts_enabled: { type: 'boolean', example: true },
      details_submitted: { type: 'boolean', example: true },
    },
  })
  data: {
    charges_enabled: boolean;
    payouts_enabled: boolean;
    details_submitted: boolean;
  };
}

