import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'usr-1' })
  id: string;

  @ApiProperty({ example: 'admin@shopspark.com' })
  email: string;

  @ApiProperty({ example: 'ShopSpark Administrator' })
  name: string;

  @ApiPropertyOptional({ example: 'ADMIN' })
  role?: string;

  @ApiPropertyOptional({ example: '+33 1 40 50 60 70' })
  phone?: string;
}

export class LoginDataPayloadDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ type: LoginUserDto })
  user: LoginUserDto;
}

export class LoginResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiPropertyOptional({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken?: string;

  @ApiProperty({ type: LoginUserDto })
  user: LoginUserDto;

  @ApiProperty({ type: LoginDataPayloadDto })
  data: LoginDataPayloadDto;
}
