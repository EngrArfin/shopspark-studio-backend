import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterResponseDto } from './dto/register-response.dto.js';
import {
  AuthMessageResponseDto,
  ChangePasswordDto,
  RequestResetCodeDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from './dto/password-reset.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(['register', 'create-user'])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User & Provider Registration',
    description: 'Register a new customer or provider account with name, email, phone number, and password.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Returns user profile and JWT token.',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User & Admin Login',
    description: 'Authenticate with email and password to receive JWT access and refresh tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access_token, refresh_token, and user payload.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change Account Password',
    description: 'Update password for the currently signed-in account by providing old and new passwords.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    type: AuthMessageResponseDto,
  })
  async changePassword(@Body() dto: ChangePasswordDto): Promise<AuthMessageResponseDto> {
    return this.authService.changePassword(dto);
  }

  @Post('request-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request Password Reset Verification Code',
    description: 'Send a 6-digit one-time password verification code to user email.',
  })
  @ApiBody({ type: RequestResetCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Reset code dispatched successfully.',
    type: AuthMessageResponseDto,
  })
  async requestResetCode(@Body() dto: RequestResetCodeDto): Promise<AuthMessageResponseDto> {
    return this.authService.requestResetCode(dto);
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Password Reset Code',
    description: 'Validate the 6-digit confirmation code sent to user email.',
  })
  @ApiBody({ type: VerifyResetCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Code validated successfully.',
    type: AuthMessageResponseDto,
  })
  async verifyResetCode(@Body() dto: VerifyResetCodeDto): Promise<AuthMessageResponseDto> {
    return this.authService.verifyResetCode(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset Forgotten Password',
    description: 'Set a new password after successful code verification.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
    type: AuthMessageResponseDto,
  })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<AuthMessageResponseDto> {
    return this.authService.resetPassword(dto);
  }
}
