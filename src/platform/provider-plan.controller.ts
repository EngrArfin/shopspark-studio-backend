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
import { PlatformService } from './platform.service.js';
import {
  GetPlansResponseDto,
  PlanDto,
  PlanFormDataDto,
} from './dto/provider-plan.dto.js';

@ApiTags('Provider Subscription Plans')
@ApiBearerAuth('JWT-auth')
@Controller('provider-plan')
export class ProviderPlanController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Vendor Membership Plans',
    description: 'Retrieve provider membership tiers, pricing, bid allowances, and perks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Plans list retrieved successfully.',
    type: GetPlansResponseDto,
  })
  async getPlans(): Promise<GetPlansResponseDto> {
    return this.platformService.getProviderPlans();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Vendor Plan by ID',
    description: 'Retrieve details of a specific subscription tier.',
  })
  @ApiParam({ name: 'id', example: 'plan-pro' })
  @ApiResponse({
    status: 200,
    description: 'Plan retrieved successfully.',
    type: PlanDto,
  })
  async getPlanById(@Param('id') id: string) {
    return this.platformService.getProviderPlanById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Vendor Subscription Plan (Admin)',
    description: 'Define a new vendor membership tier with price, billing interval, and features list.',
  })
  @ApiBody({ type: PlanFormDataDto })
  @ApiResponse({ status: 201, description: 'Plan created successfully.', type: PlanDto })
  async createPlan(@Body() dto: PlanFormDataDto) {
    return this.platformService.createProviderPlan(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Vendor Subscription Plan (Admin)',
    description: 'Update pricing, billing period, or perks of an existing plan.',
  })
  @ApiParam({ name: 'id', example: 'plan-pro' })
  @ApiBody({ type: PlanFormDataDto })
  @ApiResponse({ status: 200, description: 'Plan updated successfully.', type: PlanDto })
  async updatePlan(
    @Param('id') id: string,
    @Body() dto: PlanFormDataDto,
  ) {
    return this.platformService.updateProviderPlan(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Vendor Subscription Plan (Admin)',
    description: 'Remove a plan from active offerings.',
  })
  @ApiParam({ name: 'id', example: 'plan-pro' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully.' })
  async deletePlan(@Param('id') id: string) {
    return this.platformService.deleteProviderPlan(id);
  }
}

