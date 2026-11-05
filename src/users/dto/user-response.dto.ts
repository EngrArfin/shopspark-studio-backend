import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'usr-1',
    description: 'Unique identifier of the user (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'Jean-Luc Dupont',
    description: 'Full name of the user',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: 'contact@royalpartydecor.fr',
    description: 'Unique email address of the user',
  })
  email: string;

  @ApiPropertyOptional({
    example: '+33 6 12 34 56 78',
    description: 'Contact phone number of the user',
    nullable: true,
  })
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    example: '+33 6 12 34 56 78',
    description: 'Alias contact phone number',
  })
  phone?: string | null;

  @ApiProperty({
    example: 'USER',
    description: 'Assigned role of the user (e.g. USER, ADMIN, PROVIDER, SELLER)',
  })
  role: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Deactivated / deleted user flag',
  })
  isDeleted?: boolean;

  @ApiPropertyOptional({
    example: '15 Rue de Paris, 75001 Paris',
    description: 'Primary street address',
  })
  address?: string | null;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    description: 'Avatar image URL',
  })
  profile_image?: string | null;

  @ApiPropertyOptional({
    example: 42,
    description: 'Total party plans generated',
  })
  total_party_generated?: number;

  @ApiProperty({
    example: '2026-03-12T10:00:00.000Z',
    description: 'Account creation timestamp',
  })
  createdAt: string | Date;

  @ApiProperty({
    example: '2026-03-12T10:00:00.000Z',
    description: 'Account last updated timestamp',
  })
  updatedAt: string | Date;
}

export class UsersListResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];
}

export class SingleUserResponseWrapperDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: UserResponseDto })
  data: UserResponseDto;
}
