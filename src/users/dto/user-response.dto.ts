import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 'd9b2d63d-a233-4f9e-8d82-998246f1e29c',
    description: 'Unique identifier of the user (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address of the user',
  })
  email: string;

  @ApiPropertyOptional({
    example: '+8801700000000',
    description: 'Contact phone number of the user',
    nullable: true,
  })
  phoneNumber: string | null;

  @ApiProperty({
    example: 'USER',
    description: 'Assigned role of the user (e.g. USER, ADMIN, SELLER)',
  })
  role: string;

  @ApiProperty({
    example: '2026-10-19T18:00:00.000Z',
    description: 'Account creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-10-19T18:00:00.000Z',
    description: 'Account last updated timestamp',
  })
  updatedAt: Date;
}
