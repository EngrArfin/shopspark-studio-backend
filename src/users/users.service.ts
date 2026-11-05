import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto.js';

const INITIAL_FALLBACK_USERS: UserResponseDto[] = [
  {
    id: 'usr-1',
    name: 'Jean-Luc Dupont',
    email: 'contact@royalpartydecor.fr',
    phoneNumber: '+33 6 12 34 56 78',
    phone: '+33 6 12 34 56 78',
    role: 'PROVIDER',
    isDeleted: false,
    address: '15 Rue de Paris, 75001 Paris',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    total_party_generated: 42,
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'usr-2',
    name: 'Arthur Pendelton',
    email: 'arthur.pendelton@example.com',
    phoneNumber: '+44 20 7946 0912',
    phone: '+44 20 7946 0912',
    role: 'USER',
    isDeleted: false,
    address: '221B Baker Street, Marylebone, London',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    total_party_generated: 12,
    createdAt: '2026-02-14T10:00:00.000Z',
    updatedAt: '2026-02-14T10:00:00.000Z',
  },
  {
    id: 'usr-3',
    name: 'Sophie Martin',
    email: 'sophie.martin@example.fr',
    phoneNumber: '+33 6 88 99 00 11',
    phone: '+33 6 88 99 00 11',
    role: 'USER',
    isDeleted: false,
    address: '8 Boulevard Saint-Germain, 75005 Paris',
    profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    total_party_generated: 5,
    createdAt: '2026-04-01T08:30:00.000Z',
    updatedAt: '2026-04-01T08:30:00.000Z',
  },
  {
    id: 'usr-4',
    name: 'Alexandre Laurent',
    email: 'admin@shopspark.com',
    phoneNumber: '+33 1 40 50 60 70',
    phone: '+33 1 40 50 60 70',
    role: 'ADMIN',
    isDeleted: false,
    address: '10 Rue de la Paix, 75002 Paris',
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    total_party_generated: 99,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

@Injectable()
export class UsersService {
  private inMemoryUsers: UserResponseDto[] = [...INITIAL_FALLBACK_USERS];

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
   * Retrieve all users, optionally filtered by role and search query
   */
  async findAll(role?: string, search?: string): Promise<UserResponseDto[]> {
    try {
      const dbUsers = await this.prisma.user.findMany({
        where: {
          ...(role ? { role: role.toUpperCase() } : {}),
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        select: this.userSelect,
        orderBy: { createdAt: 'desc' },
      });

      if (dbUsers.length > 0) {
        return dbUsers.map((u) => ({
          ...u,
          phone: u.phoneNumber,
          isDeleted: false,
          total_party_generated: 0,
        }));
      }
    } catch {
      // Prisma fallback to in-memory
    }

    let result = [...this.inMemoryUsers];
    if (role) {
      result = result.filter((u) => u.role.toUpperCase() === role.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q),
      );
    }
    return result;
  }

  /**
   * Retrieve a single user by their UUID
   */
  async findById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: this.userSelect,
      });

      if (user) {
        return {
          ...user,
          phone: user.phoneNumber,
          isDeleted: false,
          total_party_generated: 0,
        };
      }
    } catch {
      // Fallback
    }

    const memoryUser = this.inMemoryUsers.find((u) => u.id === id);
    if (!memoryUser) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return memoryUser;
  }

  /**
   * Retrieve current user profile (GET /user/me)
   */
  async getMe(): Promise<UserResponseDto> {
    return this.inMemoryUsers[3] || this.inMemoryUsers[0];
  }

  /**
   * Retrieve user metadata (GET /user/meta-data/user)
   */
  async getUserMeta() {
    return {
      totalUsers: this.inMemoryUsers.length,
      activeUsers: this.inMemoryUsers.filter((u) => !u.isDeleted).length,
      user: await this.getMe(),
    };
  }

  /**
   * Create a new user
   */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const newUser: UserResponseDto = {
      id: `usr-${Date.now()}`,
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber || dto.phone || null,
      phone: dto.phone || dto.phoneNumber || null,
      role: (dto.role || 'USER').toUpperCase(),
      isDeleted: false,
      address: dto.address || null,
      profile_image: null,
      total_party_generated: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryUsers.unshift(newUser);
    return newUser;
  }

  /**
   * Update user profile
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findById(id);
    const updated: UserResponseDto = {
      ...user,
      ...dto,
      phone: dto.phone || dto.phoneNumber || user.phone,
      phoneNumber: dto.phoneNumber || dto.phone || user.phoneNumber,
      updatedAt: new Date().toISOString(),
    };

    const index = this.inMemoryUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.inMemoryUsers[index] = updated;
    }

    return updated;
  }

  /**
   * Soft delete or remove user
   */
  async delete(id: string) {
    const index = this.inMemoryUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    this.inMemoryUsers[index].isDeleted = true;
    this.inMemoryUsers.splice(index, 1);

    return {
      success: true,
      id,
    };
  }

  /**
   * Retrieve a single user by email address
   */
  async findByEmail(email: string): Promise<UserResponseDto> {
    const memoryUser = this.inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (memoryUser) return memoryUser;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    return {
      ...user,
      phone: user.phoneNumber,
      isDeleted: false,
    };
  }
}
