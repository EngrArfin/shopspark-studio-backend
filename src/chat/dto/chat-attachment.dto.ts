import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UploadAttachmentDto {
  @ApiProperty({
    example: 'party-venue-layout.pdf',
    description: 'Original name of the uploaded document or image file',
  })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'MIME type of the attachment (e.g. image/jpeg, image/png, application/pdf)',
  })
  @IsString()
  @IsNotEmpty()
  fileType!: string;

  @ApiProperty({
    example: 1048576,
    description: 'File size in bytes (max 10MB)',
  })
  @IsNumber()
  fileSize!: number;

  @ApiPropertyOptional({
    example: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
    description: 'Optional Base64 encoded file string for direct inline uploads',
  })
  @IsOptional()
  @IsString()
  fileBase64?: string;
}

export class AttachmentResponseDataDto {
  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200',
    description: 'Hosted CDN public URL of uploaded attachment',
  })
  url!: string;

  @ApiProperty({ example: 'party-venue-layout.pdf' })
  fileName!: string;

  @ApiProperty({ example: 'application/pdf' })
  fileType!: string;

  @ApiProperty({ example: 1048576 })
  fileSize!: number;
}

export class AttachmentResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: AttachmentResponseDataDto })
  data!: AttachmentResponseDataDto;
}

