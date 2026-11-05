import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
  CreateAdminReviewDto,
  ReviewsResponseDto,
  UpdateAdminReviewDto,
} from './dto/admin-review.dto.js';

@ApiTags('Admin Reviews & Testimonials')
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly adminService: AdminService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Reviews & Testimonials (Admin Dashboard)',
    description: 'Retrieve parent reviews, provider testimonials, star ratings, and publication status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully.',
    type: ReviewsResponseDto,
  })
  async getReviews(): Promise<ReviewsResponseDto> {
    return this.adminService.getReviews();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add New Testimonial Review (Admin & Parents)',
    description: 'Create a new review rating with parent name, avatar, rating score, and feedback text.',
  })
  @ApiBody({ type: CreateAdminReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
  })
  async createReview(@Body() dto: CreateAdminReviewDto) {
    return this.adminService.createReview(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Review (Status / Text)',
    description: 'Moderate review visibility (Active/Inactive), adjust rating, or edit feedback.',
  })
  @ApiParam({ name: 'id', description: 'Review ID', example: 'rev-1' })
  @ApiBody({ type: UpdateAdminReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully.',
  })
  async updateReview(
    @Param('id') id: string,
    @Body() dto: UpdateAdminReviewDto,
  ) {
    return this.adminService.updateReview(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Review',
    description: 'Remove a testimonial review from display.',
  })
  @ApiParam({ name: 'id', description: 'Review ID', example: 'rev-1' })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully.',
  })
  async deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }
}

