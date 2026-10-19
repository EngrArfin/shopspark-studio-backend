import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    phoneNumber: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  /**
   * Retrieve all users, optionally filtered by role
   */
  async findAll(role?: string): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: this.userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve a single user by their UUID
   */
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return user;
  }

  /**
   * Retrieve a single user by email address
   */
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    return user;
  }
}
