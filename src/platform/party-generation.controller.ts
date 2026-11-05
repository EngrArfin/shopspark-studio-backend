import {
  Body,
  Controller,
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
import { PlatformService } from './platform.service.js';
import {
  PartyGenerationRequestDto,
  PartyGenerationResponseDto,
} from './dto/party-generation.dto.js';

@ApiTags('Party Planning & AI Generation')
@ApiBearerAuth('JWT-auth')
@Controller('part-generation')
export class PartyGenerationController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Save AI-Generated Party Plan',
    description: 'Save customized party itinerary, decorative themes, gift ideas, and timeline breakdown.',
  })
  @ApiBody({ type: PartyGenerationRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Party plan saved successfully.',
    type: PartyGenerationResponseDto,
  })
  async savePartyPlan(@Body() dto: PartyGenerationRequestDto) {
    return this.platformService.savePartyPlan(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All User Party Plans',
    description: 'Retrieve all saved celebration plans for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Party plans list retrieved.',
  })
  async getPartyPlans() {
    return this.platformService.getPartyPlans();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Single Party Plan by ID',
    description: 'Retrieve full schedule, suggested gifts, and invitation counts for a party plan.',
  })
  @ApiParam({ name: 'id', example: 'plan-101' })
  @ApiResponse({
    status: 200,
    description: 'Party plan details retrieved.',
    type: PartyGenerationResponseDto,
  })
  async getPartyPlanById(@Param('id') id: string) {
    return this.platformService.getPartyPlanById(id);
  }

  @Post('track-generation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Track AI Party Generation Counter',
    description: 'Increment platform metric counter whenever an AI party generation prompt is submitted.',
  })
  @ApiResponse({ status: 200, description: 'Tracked successfully.' })
  async trackGeneration() {
    return this.platformService.trackGeneration();
  }
}

