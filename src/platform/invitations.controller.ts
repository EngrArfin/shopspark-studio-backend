import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformService } from './platform.service.js';
import {
  CancelInvitationDto,
  InvitationDto,
  SendInvitationRequestDto,
} from './dto/invitations.dto.js';

@ApiTags('Party Invitations & RSVP')
@ApiBearerAuth('JWT-auth')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly platformService: PlatformService) {}

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send Digital Party Invitation Card',
    description: 'Dispatch a themed digital invitation card with RSVP confirmation link to a guest email.',
  })
  @ApiBody({ type: SendInvitationRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent successfully.',
    type: InvitationDto,
  })
  async sendInvitation(@Body() dto: SendInvitationRequestDto) {
    return this.platformService.sendInvitation(dto);
  }

  @Get('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm Guest RSVP via Token',
    description: 'Validate token and confirm guest attendance for a party celebration.',
  })
  @ApiQuery({ name: 'token', example: 'tok_inv_98412_lucas' })
  @ApiResponse({ status: 200, description: 'RSVP confirmed successfully.' })
  async confirmInvitation(@Query('token') token: string) {
    return this.platformService.confirmInvitation(token);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Decline / Cancel Guest RSVP via Token',
    description: 'Mark guest RSVP as unable to attend.',
  })
  @ApiBody({ type: CancelInvitationDto })
  @ApiResponse({ status: 200, description: 'RSVP cancelled successfully.' })
  async cancelInvitation(@Body() dto: CancelInvitationDto) {
    return this.platformService.cancelInvitation(dto.token);
  }
}

