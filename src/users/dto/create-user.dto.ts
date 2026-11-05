import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Sophie Martin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'sophie.martin@example.fr' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+33 6 88 99 00 11' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '+33 6 88 99 00 11' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'USER', enum: ['USER', 'ADMIN', 'PROVIDER', 'SELLER'] })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: 'Password123!' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: '8 Boulevard Saint-Germain, 75005 Paris' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Sophie Martin' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'sophie.martin@example.fr' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+33 6 88 99 00 11' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '+33 6 88 99 00 11' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'USER', enum: ['USER', 'ADMIN', 'PROVIDER', 'SELLER'] })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: '8 Boulevard Saint-Germain, 75005 Paris' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' })
  @IsOptional()
  @IsString()
  profile_image?: string;
}

