import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import {
  AdminOverviewResponseDto,
  AdminStatsResponseDto,
} from './dto/admin-dashboard-stats.dto.js';
import {
  AuditLogsResponseDto,
  SystemSettingsResponseDto,
  UpdateSystemDefaultsDto,
} from './dto/admin-settings.dto.js';

@ApiTags('Admin Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Admin Dashboard Overview & KPIs',
    description:
      'Retrieve high-level metrics for the Admin Dashboard: Total Users, Total Products, Total Providers, Total Revenue, month-over-month percentage changes, 6-month monthly revenue trends, order status distribution, recent orders feed, and top-performing providers.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin dashboard overview retrieved successfully.',
    type: AdminOverviewResponseDto,
  })
  async getDashboardOverview(): Promise<AdminOverviewResponseDto> {
    return this.adminService.getDashboardOverview();
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Platform High-Level Statistics',
    description:
      'Retrieve platform aggregate totals including total users, total party plans created, total provider bookings, and total completed orders.',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform statistics retrieved successfully.',
    type: AdminStatsResponseDto,
  })
  async getStats(): Promise<AdminStatsResponseDto> {
    return this.adminService.getStats();
  }

  @Get('admin/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Admin Platform Settings & System Defaults',
    description:
      'Retrieve current platform defaults including default timezone, platform currency, commission fee rate, maintenance mode, and payout thresholds.',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform settings retrieved successfully.',
    type: SystemSettingsResponseDto,
  })
  async getSettings(): Promise<SystemSettingsResponseDto> {
    return this.adminService.getSettings();
  }

  @Patch('admin/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Admin Platform Settings & System Defaults',
    description:
      'Configure global application defaults such as commission rate, default currency, timezone, support email, and policy texts.',
  })
  @ApiBody({ type: UpdateSystemDefaultsDto })
  @ApiResponse({
    status: 200,
    description: 'Platform settings updated successfully.',
    type: SystemSettingsResponseDto,
  })
  async updateSettings(
    @Body() dto: UpdateSystemDefaultsDto,
  ): Promise<SystemSettingsResponseDto> {
    return this.adminService.updateSettings(dto);
  }

  @Get('admin/audit-logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Audit & Compliance Logs',
    description:
      'Retrieve recent administrator activity, policy adjustments, and system events for compliance tracking.',
  })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully.',
    type: AuditLogsResponseDto,
  })
  async getAuditLogs(): Promise<AuditLogsResponseDto> {
    return this.adminService.getAuditLogs();
  }
}

