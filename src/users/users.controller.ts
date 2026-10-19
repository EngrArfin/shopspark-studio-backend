import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all registered users (password field is excluded). Supports optional role filtering.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter users by role (e.g. USER, ADMIN, SELLER)',
    example: 'USER',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    type: [UserResponseDto],
  })
  async findAll(@Query('role') role?: string): Promise<UserResponseDto[]> {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve detailed profile of a specific user using their UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique UUID of the user',
    example: 'd9b2d63d-a233-4f9e-8d82-998246f1e29c',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User with the specified ID was not found.',
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }
}
