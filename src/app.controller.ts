import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Platform Health Check & Welcome Endpoint',
    description: 'Verify server connectivity and operational status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Server is healthy and running.',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
