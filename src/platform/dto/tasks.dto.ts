import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({ example: 'task-1' })
  id: string;

  @ApiProperty({ example: 'Order birthday cake from bakery' })
  name: string;

  @ApiProperty({ example: false })
  isComplete: boolean;

  @ApiProperty({ example: 'Food & Drinks' })
  category: string;

  @ApiProperty({ example: 'HIGH', enum: ['LOW', 'MEDIUM', 'HIGH'] })
  priority: string;

  @ApiProperty({ example: '2026-11-25' })
  dueDate: string;

  @ApiProperty({ example: 5 })
  daysAhead: number;

  @ApiProperty({ example: 'usr-2' })
  userId: string;

  @ApiProperty({ example: '2026-10-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-20T10:00:00.000Z' })
  updatedAt: string;
}

export class CreateTaskRequestDto {
  @ApiProperty({ example: 'Order birthday cake from bakery' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Food & Drinks' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 'HIGH' })
  @IsNotEmpty()
  @IsString()
  priority: string;

  @ApiProperty({ example: '2026-11-25' })
  @IsNotEmpty()
  @IsString()
  dueDate: string;
}

export class UpdateTaskRequestDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isComplete?: boolean;

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Order vegan birthday cake' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Food & Drinks' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '2026-11-26' })
  @IsOptional()
  @IsString()
  dueDate?: string;
}

