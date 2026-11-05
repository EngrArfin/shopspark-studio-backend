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
  ContactMessageDto,
  ContactResponseDto,
  CreateContactMessageDto,
  UpdateContactStatusDto,
} from './dto/admin-contact.dto.js';

@ApiTags('Admin Contact Inquiries')
@ApiBearerAuth('JWT-auth')
@Controller('contact')
export class ContactController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Contact Inquiries (Admin Dashboard)',
    description: 'Retrieve incoming support inquiries, bulk booking questions, and customer requests.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact inquiries retrieved successfully.',
    type: ContactResponseDto,
  })
  async getMessages(): Promise<ContactResponseDto> {
    return this.adminService.getContactMessages();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Contact Inquiry by ID',
    description: 'Retrieve full text and sender details of a contact message.',
  })
  @ApiParam({ name: 'id', description: 'Message ID', example: 'ct-1' })
  @ApiResponse({
    status: 200,
    description: 'Inquiry details retrieved successfully.',
    type: ContactMessageDto,
  })
  async getMessageById(@Param('id') id: string): Promise<ContactMessageDto> {
    return this.adminService.getContactMessageById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit Contact Inquiry Form (Public)',
    description: 'Submit an inquiry or customer service question to platform administrators.',
  })
  @ApiBody({ type: CreateContactMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully.',
  })
  async createMessage(@Body() dto: CreateContactMessageDto) {
    return this.adminService.createContactMessage(dto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Inquiry Resolution Status',
    description: 'Update the handling status of a customer message (PENDING, IN_PROGRESS, RESOLVED).',
  })
  @ApiParam({ name: 'id', description: 'Message ID', example: 'ct-1' })
  @ApiBody({ type: UpdateContactStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully.',
    type: ContactMessageDto,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactStatusDto,
  ): Promise<ContactMessageDto> {
    return this.adminService.updateContactStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Contact Inquiry',
    description: 'Delete a processed inquiry from the dashboard.',
  })
  @ApiParam({ name: 'id', description: 'Message ID', example: 'ct-1' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully.',
  })
  async deleteMessage(@Param('id') id: string) {
    return this.adminService.deleteContactMessage(id);
  }
}

