import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformService } from './platform.service.js';
import {
  CheckoutPaymentRequestDto,
  CheckoutPaymentResponseDto,
  OnboardingLinkResponseDto,
  OnboardingStatusResponseDto,
} from './dto/payment.dto.js';

@ApiTags('Stripe Provider Payment')
@ApiBearerAuth('JWT-auth')
@Controller('provider/payment')
export class PaymentController {
  constructor(private readonly platformService: PlatformService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create Checkout Payment Session',
    description: 'Generate a secure Stripe Checkout URL to pay for an approved provider quote.',
  })
  @ApiBody({ type: CheckoutPaymentRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Stripe redirect URL generated.',
    type: CheckoutPaymentResponseDto,
  })
  async checkoutPayment(@Body() dto: CheckoutPaymentRequestDto): Promise<CheckoutPaymentResponseDto> {
    return this.platformService.checkoutPayment(dto.quoteId);
  }

  @Get('onboarding-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Stripe Connect Express Onboarding URL',
    description: 'Retrieve a custom Stripe Connect Express onboarding URL for vendor payout banking setup.',
  })
  @ApiResponse({
    status: 200,
    description: 'Onboarding URL retrieved.',
    type: OnboardingLinkResponseDto,
  })
  async getOnboardingLink(): Promise<OnboardingLinkResponseDto> {
    return this.platformService.getOnboardingLink();
  }

  @Get('onboarding-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check Stripe Connect Verification Status',
    description: 'Verify if vendor payouts and charges are active on Stripe.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status retrieved.',
    type: OnboardingStatusResponseDto,
  })
  async getOnboardingStatus(): Promise<OnboardingStatusResponseDto> {
    return this.platformService.getOnboardingStatus();
  }

  @Get('login-dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Stripe Express Dashboard Login Link',
    description: 'Retrieve a single-use login link to the vendor Stripe Express balance & tax portal.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard link generated.',
    type: OnboardingLinkResponseDto,
  })
  async loginDashboard(): Promise<OnboardingLinkResponseDto> {
    return this.platformService.loginDashboard();
  }
}

