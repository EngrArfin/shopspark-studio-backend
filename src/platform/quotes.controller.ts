import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformService } from './platform.service.js';
import { QuoteRequestDto, UpdateQuoteStatusDto } from './dto/quotes.dto.js';

@ApiTags('Quotes & Event Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Request Provider Quote (Customer)',
    description: 'Submit an event quote request to a verified provider with date, guest count, location, and requirements.',
  })
  @ApiBody({ type: QuoteRequestDto })
  @ApiResponse({ status: 201, description: 'Quote request submitted successfully.' })
  async createQuote(@Body() dto: QuoteRequestDto) {
    return this.platformService.createQuote(dto);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get My Quotes & Bookings (Customer)',
    description: 'Retrieve all event quotes and bookings initiated by the authenticated customer.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Quotes list retrieved.' })
  async getMyQuotes(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.platformService.getMyQuotes(Number(page) || 1, Number(limit) || 10);
  }

  @Get('provider/my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Incoming Quotes (Provider)',
    description: 'Retrieve incoming booking quote inquiries received by the authenticated vendor provider.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Provider quote inquiries retrieved.' })
  async getProviderQuotes(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.platformService.getProviderQuotes(Number(page) || 1, Number(limit) || 10);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Quote Status (Provider)',
    description: 'Accept (BOOKED) or decline (CANCELLED) a customer quote booking.',
  })
  @ApiParam({ name: 'id', example: 'quote-101' })
  @ApiBody({ type: UpdateQuoteStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated successfully.' })
  async updateQuoteStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteStatusDto,
  ) {
    return this.platformService.updateQuoteStatus(id, dto.status);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel Quote Booking (Customer)',
    description: 'Cancel a submitted or pending event quote.',
  })
  @ApiParam({ name: 'id', example: 'quote-101' })
  @ApiResponse({ status: 200, description: 'Quote cancelled successfully.' })
  async cancelQuote(@Param('id') id: string) {
    return this.platformService.cancelQuote(id);
  }
}

