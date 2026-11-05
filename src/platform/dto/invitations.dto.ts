import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendInvitationRequestDto {
  @ApiProperty({ example: 'guest@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Lucas Dupont' })
  @IsNotEmpty()
  @IsString()
  guest_name: string;

  @ApiPropertyOptional({ example: '+33 6 44 55 66 77' })
  @IsOptional()
  @IsString()
  guest_phone?: string;

  @ApiProperty({ example: 'plan-101' })
  @IsNotEmpty()
  @IsString()
  party_id: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}

export class InvitationDto {
  @ApiProperty({ example: 'inv-101' })
  id: string;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ example: 'guest@example.com' })
  email: string;

  @ApiProperty({ example: 'Lucas Dupont' })
  guest_name: string;

  @ApiPropertyOptional({ example: '+33 6 44 55 66 77' })
  guest_phone?: string;

  @ApiProperty({ example: 'plan-101' })
  party_id: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600' })
  image: string;

  @ApiProperty({ example: 'tok_inv_sample_98412' })
  invitationToken: string;

  @ApiProperty({ example: '2026-10-24T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-24T10:00:00.000Z' })
  updatedAt: string;
}

export class CancelInvitationDto {
  @ApiProperty({ example: 'tok_inv_sample_98412' })
  @IsNotEmpty()
  @IsString()
  token: string;
}

