import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import {
  CreateNewsletterSubscriberDto,
  NewsletterResponseDto,
  SendNewsletterCampaignDto,
} from './dto/admin-newsletter.dto.js';

@ApiTags('Admin Newsletter')
@ApiBearerAuth('JWT-auth')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Newsletter Subscribers (Admin Dashboard)',
    description: 'Retrieve list of email newsletter subscribers with subscription timestamps and status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscribers retrieved successfully.',
    type: NewsletterResponseDto,
  })
  async getSubscribers(): Promise<NewsletterResponseDto> {
    return this.adminService.getNewsletterSubscribers();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Subscribe to Newsletter',
    description: 'Register an email address to receive party discounts, DIY tips, and product releases.',
  })
  @ApiBody({ type: CreateNewsletterSubscriberDto })
  @ApiResponse({
    status: 201,
    description: 'Email subscribed successfully.',
  })
  async subscribe(@Body() dto: CreateNewsletterSubscriberDto) {
    return this.adminService.createNewsletterSubscriber(dto);
  }

  @Post('campaign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dispatch Newsletter Campaign Blast (Admin)',
    description: 'Send a promotional email or announcement to all active platform subscribers.',
  })
  @ApiBody({ type: SendNewsletterCampaignDto })
  @ApiResponse({
    status: 200,
    description: 'Campaign dispatched successfully.',
  })
  async sendCampaign(@Body() dto: SendNewsletterCampaignDto) {
    return this.adminService.sendNewsletterCampaign(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unsubscribe from Newsletter',
    description: 'Remove or unsubscribe an email from the newsletter distribution list.',
  })
  @ApiParam({ name: 'id', description: 'Subscriber ID or email', example: 'sub-1' })
  @ApiResponse({
    status: 200,
    description: 'Subscriber removed successfully.',
  })
  async unsubscribe(@Param('id') id: string) {
    return this.adminService.deleteNewsletterSubscriber(id);
  }
}

