import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactMessageDto {
  @ApiProperty({ example: 'ct-1' })
  id: string;

  @ApiProperty({ example: 1 })
  no: number;

  @ApiProperty({ example: 'Sophie Martin' })
  name: string;

  @ApiProperty({ example: 'sophie.martin@example.fr' })
  email: string;

  @ApiProperty({ example: 'Inquiry about bulk corporate event DIY boxes' })
  subject: string;

  @ApiProperty({ example: 'Hello, we would like to order 50 customized DIY party craft boxes for our annual family day event. Could you provide a bulk quotation?' })
  message: string;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'] })
  status: string;

  @ApiProperty({ example: '2026-10-22T11:20:00.000Z' })
  createdAt: string;
}

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Sophie Martin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'sophie.martin@example.fr' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Inquiry about bulk corporate event DIY boxes' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Hello, we would like to order 50 customized DIY party boxes.' })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class UpdateContactStatusDto {
  @ApiProperty({ example: 'RESOLVED', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'] })
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class ContactResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [ContactMessageDto] })
  data: ContactMessageDto[];
}

