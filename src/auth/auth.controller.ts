import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterResponseDto } from './dto/register-response.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User Registration',
    description: 'Register a new user account with name, email, phoneNumber, and password.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Returns user profile and access token.',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (e.g. invalid email format, phone format, or missing fields).',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. User with this email already exists.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticate user with email and password to receive an access token.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns user profile and access token.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (e.g. invalid email format or password too short).',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
}
