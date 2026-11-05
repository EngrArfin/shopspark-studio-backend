import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminDiyActivityDto {
  @ApiProperty({ example: 'act-1' })
  id: string;

  @ApiProperty({ example: 'Origami Magic Animals' })
  title: string;

  @ApiProperty({ example: 'Step-by-step Japanese paper folding fun for creative young minds.' })
  description: string;

  @ApiProperty({ example: 'Fold diagonal crease, align edges to centerline, reverse fold tips.' })
  instructionSheet: string;

  @ApiProperty({ example: '6 - 12 Years' })
  ageRange: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=origami-guide' })
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/origami-animals.pdf' })
  pdfUrl?: string;

  @ApiPropertyOptional({ example: 'origami-guide.pdf' })
  pdfFileName?: string;

  @ApiPropertyOptional({ example: 'origami-tutorial.mp4' })
  videoFileName?: string;

  @ApiProperty({ example: '2026-03-15T10:00:00.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: '2026-03-15T10:00:00.000Z' })
  updatedAt?: string;
}

export class CreateAdminDiyActivityDto {
  @ApiProperty({ example: 'Origami Magic Animals' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Step-by-step Japanese paper folding fun for creative young minds.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Fold diagonal crease, align edges to centerline, reverse fold tips.' })
  @IsNotEmpty()
  @IsString()
  instructionSheet: string;

  @ApiProperty({ example: '6 - 12 Years' })
  @IsNotEmpty()
  @IsString()
  ageRange: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=origami-guide' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/origami-animals.pdf' })
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @ApiPropertyOptional({ example: 'origami-animals.pdf' })
  @IsOptional()
  @IsString()
  pdfFileName?: string;

  @ApiPropertyOptional({ example: 'origami-tutorial.mp4' })
  @IsOptional()
  @IsString()
  videoFileName?: string;
}

export class UpdateAdminDiyActivityDto {
  @ApiPropertyOptional({ example: 'Origami Magic Animals (Advanced)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Updated instructions' })
  @IsOptional()
  @IsString()
  instructionSheet?: string;

  @ApiPropertyOptional({ example: '7 - 14 Years' })
  @IsOptional()
  @IsString()
  ageRange?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=origami-guide-v2' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/origami-v2.pdf' })
  @IsOptional()
  @IsString()
  pdfUrl?: string;
}

export class DiyActivityResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [AdminDiyActivityDto] })
  data: AdminDiyActivityDto[];
}

export class SingleDiyActivityResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: AdminDiyActivityDto })
  data: AdminDiyActivityDto;
}

