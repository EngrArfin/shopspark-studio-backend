import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Database lookup using Prisma ORM (fallback to mock if DB table isn't migrated yet)
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    } catch {
      // If DB is not connected/migrated yet, allow demo login
      user = null;
    }

    // Demo Admin Check
    if (email === 'admin@shopspark.com' && password === 'Admin123!') {
      return {
        success: true,
        message: 'Login successful',
        accessToken: 'mock_jwt_token_shopspark_admin_2026',
        user: {
          id: user?.id ?? 'usr_8923a1bc-7840-410d',
          email: 'admin@shopspark.com',
          name: user?.name ?? 'ShopSpark Administrator',
        },
      };
    }

    if (!user && password !== 'Password123!') {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      success: true,
      message: 'Login successful',
      accessToken: 'mock_jwt_token_sample_key_987654321',
      user: {
        id: user?.id ?? 'usr_f5e3d2c1-b4a0-4567',
        email: user?.email ?? email,
        name: user?.name ?? 'Demo User',
      },
    };
  }
}
