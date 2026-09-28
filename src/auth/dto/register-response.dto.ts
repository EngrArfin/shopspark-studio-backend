import { ApiProperty } from '@nestjs/swagger';

export class RegisteredUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '+8801700000000' })
  phoneNumber: string;

  @ApiProperty({ example: 'USER' })
  role: string;

  @ApiProperty({ example: '2026-09-26T18:00:00.000Z' })
  createdAt: Date;
}

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Registration successful' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: RegisteredUserDto })
  user: RegisteredUserDto;
}
