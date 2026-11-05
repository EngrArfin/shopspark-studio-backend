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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import {
  SingleUserResponseWrapperDto,
  UserResponseDto,
  UsersListResponseDto,
} from './dto/user-response.dto.js';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto.js';

@ApiTags('Admin User Management')
@ApiBearerAuth('JWT-auth')
@Controller(['user', 'users'])
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All Users (Admin Dashboard & Directory)',
    description:
      'Retrieve a list of all registered platform users with optional role filtering and keyword search.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter users by role (USER, ADMIN, PROVIDER, SELLER)',
    example: 'USER',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by user name or email',
    example: 'Sophie',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    type: UsersListResponseDto,
  })
  async findAll(
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    const users = await this.usersService.findAll(role, search);
    return {
      statusCode: 200,
      success: true,
      data: users,
    };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Current Authenticated User Profile',
    description: 'Retrieve profile details of the currently logged-in user or admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully.',
    type: SingleUserResponseWrapperDto,
  })
  async getMe() {
    const user = await this.usersService.getMe();
    return {
      statusCode: 200,
      success: true,
      data: user,
    };
  }

  @Get('meta-data/user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get User Metadata & Counts',
    description: 'Retrieve user count statistics and current session profile.',
  })
  @ApiResponse({
    status: 200,
    description: 'User metadata retrieved successfully.',
  })
  async getUserMeta() {
    const data = await this.usersService.getUserMeta();
    return {
      statusCode: 200,
      success: true,
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get User by ID',
    description: 'Retrieve detailed profile of a specific user using their UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique UUID of the user',
    example: 'usr-1',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: SingleUserResponseWrapperDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User with the specified ID was not found.',
  })
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      statusCode: 200,
      success: true,
      data: user,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create User (Admin)',
    description: 'Register a new user account directly from the admin panel.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: SingleUserResponseWrapperDto,
  })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return {
      statusCode: 201,
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Current User Profile',
    description: 'Update the profile of the current user or modify user details.',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: SingleUserResponseWrapperDto,
  })
  async updateCurrent(@Body() dto: UpdateUserDto) {
    const me = await this.usersService.getMe();
    const updated = await this.usersService.update(me.id, dto);
    return {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: updated,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update User by ID (Admin)',
    description: 'Update role, contact details, or profile information of a user.',
  })
  @ApiParam({ name: 'id', example: 'usr-1' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: SingleUserResponseWrapperDto,
  })
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.usersService.update(id, dto);
    return {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: updated,
    };
  }

  @Delete('delete-user/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete User (Admin Dashboard)',
    description: 'Remove or deactivate a user account.',
  })
  @ApiParam({ name: 'id', example: 'usr-1' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete User by ID',
    description: 'Remove or deactivate a user account.',
  })
  @ApiParam({ name: 'id', example: 'usr-1' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
