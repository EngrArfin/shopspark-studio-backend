import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PartySectionItemDto {
  @ApiProperty({ example: 'Safari animal scavenger hunt clue cards' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sortOrder: number;
}

export class PartySectionDto {
  @ApiProperty({ example: 'Games & Entertainment' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: [PartySectionItemDto] })
  @IsArray()
  items: PartySectionItemDto[];
}

export class PartyTimelineEventDto {
  @ApiProperty({ example: '14:30' })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({ example: 'Guest arrivals and face painting station' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sortOrder: number;
}

export class SuggestedGiftItemDto {
  @ApiProperty({ example: 'prod-001' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class PartyGenerationRequestDto {
  @ApiProperty({ example: 'Leo’s 7th Safari Adventure Birthday' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '2026-11-28' })
  @IsNotEmpty()
  @IsString()
  scheduledDate: string;

  @ApiProperty({ type: [PartySectionDto] })
  @IsArray()
  sections: PartySectionDto[];

  @ApiProperty({ type: [PartyTimelineEventDto] })
  @IsArray()
  timelineEvents: PartyTimelineEventDto[];

  @ApiPropertyOptional({ type: [SuggestedGiftItemDto] })
  @IsOptional()
  @IsArray()
  suggestedGifts?: SuggestedGiftItemDto[];
}

export class PartyGenerationResponseDto {
  @ApiProperty({ example: 'plan-101' })
  id: string;

  @ApiProperty({ example: 'Leo’s 7th Safari Adventure Birthday' })
  title: string;

  @ApiProperty({ example: '2026-11-28' })
  scheduledDate: string;

  @ApiProperty({ example: 12 })
  totalInvitation: number;

  @ApiProperty({ example: 10 })
  totalInvitationConfirm: number;

  @ApiProperty({ example: 2 })
  totalPendingInvitaion: number;

  @ApiProperty({ example: 0 })
  totalInvitationCancel: number;

  @ApiProperty({ type: [PartySectionDto] })
  sections: PartySectionDto[];

  @ApiProperty({ type: [PartyTimelineEventDto] })
  timelineEvents: PartyTimelineEventDto[];

  @ApiProperty({ type: [SuggestedGiftItemDto] })
  suggestedGifts: SuggestedGiftItemDto[];

  @ApiProperty({ example: '2026-10-20T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-20T10:00:00.000Z' })
  updatedAt: string;
}

