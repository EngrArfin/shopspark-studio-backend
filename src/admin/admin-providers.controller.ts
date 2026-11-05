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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import {
  AdminProviderItemDto,
  AdminProviderQueryDto,
  PaginatedAdminProvidersResponseDto,
  ProviderActionResponseDto,
} from './dto/admin-provider.dto.js';

@ApiTags('Admin Provider Management')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class AdminProvidersController {
  constructor(private readonly adminService: AdminService) {}

  @Get('providers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Providers (Admin Dashboard & Directory)',
    description:
      'Retrieve paginated vendor providers with filter by service category, pricing, search keywords, verification status, and ratings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider list retrieved successfully.',
    type: PaginatedAdminProvidersResponseDto,
  })
  async getProviders(
    @Query() query: AdminProviderQueryDto,
  ): Promise<PaginatedAdminProvidersResponseDto> {
    return this.adminService.getProviders(query);
  }

  @Get('providers/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Provider by ID',
    description: 'Retrieve detailed provider store profile, business documentation, and portfolio items.',
  })
  @ApiParam({ name: 'id', description: 'Provider ID or User ID', example: 'prv-1' })
  @ApiResponse({
    status: 200,
    description: 'Provider profile details retrieved successfully.',
    type: ProviderActionResponseDto,
  })
  async getProviderById(@Param('id') id: string): Promise<ProviderActionResponseDto> {
    const data = await this.adminService.getProviderById(id);
    return {
      statusCode: 200,
      success: true,
      message: 'Provider retrieved successfully',
      data,
    };
  }

  @Patch('provider-requests/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve Provider Application',
    description: 'Approve an onboarding vendor request, granting full storefront publishing rights and verified badge.',
  })
  @ApiParam({ name: 'id', description: 'Provider ID', example: 'prv-3' })
  @ApiResponse({
    status: 200,
    description: 'Provider application approved successfully.',
    type: ProviderActionResponseDto,
  })
  async approveProvider(@Param('id') id: string): Promise<ProviderActionResponseDto> {
    const data = await this.adminService.approveProvider(id);
    return {
      statusCode: 200,
      success: true,
      message: `Provider '${data.bussinessName}' approved successfully`,
      data,
    };
  }

  @Delete('provider-requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reject Provider Application',
    description: 'Reject an onboarding vendor request or suspend unverified provider.',
  })
  @ApiParam({ name: 'id', description: 'Provider ID', example: 'prv-3' })
  @ApiResponse({
    status: 200,
    description: 'Provider application rejected successfully.',
    type: ProviderActionResponseDto,
  })
  async rejectProvider(@Param('id') id: string): Promise<ProviderActionResponseDto> {
    const data = await this.adminService.rejectProvider(id);
    return {
      statusCode: 200,
      success: true,
      message: `Provider '${data.bussinessName}' rejected/suspended successfully`,
      data,
    };
  }

  @Post('request-provider')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit Provider Registration Request',
    description: 'Submit an application to become a certified party entertainment or decor provider.',
  })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully.',
  })
  async requestProvider(@Body() body: any) {
    return {
      statusCode: 201,
      success: true,
      message: 'Provider application submitted successfully for review.',
      data: body,
    };
  }

  @Post('provider/update-profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Provider Store Profile',
    description: 'Update vendor store information, bio, social links, and portfolio images.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
  })
  async updateProfile(@Body() body: any) {
    return {
      statusCode: 200,
      success: true,
      message: 'Provider profile updated successfully.',
      data: body,
    };
  }
}

