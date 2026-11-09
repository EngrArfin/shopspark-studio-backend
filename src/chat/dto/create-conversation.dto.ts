import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ParticipantDto {
  @ApiProperty({ example: 'usr_c001', description: 'Unique user identifier' })
  userId!: string;

  @ApiProperty({ example: 'Sarah Jenkins', description: 'Participant full name' })
  name!: string;

  @ApiProperty({ example: 'sarah.j@example.com', description: 'Participant email address' })
  email!: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    description: 'Avatar image URL',
  })
  avatarUrl?: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN', 'PROVIDER'], description: 'User platform role' })
  role!: string;

  @ApiProperty({ example: true, description: 'Current WebSocket online status' })
  isOnline!: boolean;

  @ApiProperty({ example: '2026-11-09T18:30:00.000Z', description: 'Last active timestamp' })
  lastSeenAt!: string;
}

export class CreateConversationDto {
  @ApiProperty({
    example: ['usr_c001', 'prov_p001'],
    description: 'Array of participant user IDs included in the chat',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  participantIds!: string[];

  @ApiPropertyOptional({
    example: 'Magical Princess Party Booking Inquiry',
    description: 'Optional conversation title or subject topic',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'ord_1001',
    description: 'Optional linked order ID for order-specific support chat',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    example: 'quot_5001',
    description: 'Optional linked quote ID for provider price discussions',
  })
  @IsOptional()
  @IsString()
  quoteId?: string;

  @ApiPropertyOptional({
    example: 'prod_diy_001',
    description: 'Optional linked product ID for product inquiry',
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({
    example: 'Hello! I would like to inquire about the party entertainer availability.',
    description: 'Initial message content to send immediately upon conversation creation',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  initialMessage?: string;
}

export class ConversationQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'Sarah', description: 'Search query by participant name or title' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class ConversationResponseDto {
  @ApiProperty({ example: 'conv_8801', description: 'Unique conversation ID' })
  id!: string;

  @ApiPropertyOptional({ example: 'DIY Box Customization Inquiry', description: 'Conversation title' })
  title?: string;

  @ApiProperty({ type: [ParticipantDto], description: 'Participants in this conversation' })
  participants!: ParticipantDto[];

  @ApiPropertyOptional({
    description: 'Most recent message snippet in conversation',
    example: {
      id: 'msg_9901',
      senderId: 'prov_p001',
      senderName: 'Magic Sparkles Ent.',
      content: 'Yes, we are available on that date! Looking forward to it.',
      createdAt: '2026-11-09T18:45:00.000Z',
    },
  })
  lastMessage?: any;

  @ApiPropertyOptional({ example: '2026-11-09T18:45:00.000Z', description: 'Timestamp of last message' })
  lastMessageAt?: string;

  @ApiProperty({ example: 2, description: 'Unread message count for the authenticated user' })
  unreadCount!: number;

  @ApiPropertyOptional({ example: 'ord_1001', description: 'Linked order ID' })
  orderId?: string;

  @ApiPropertyOptional({ example: 'quot_5001', description: 'Linked quote ID' })
  quoteId?: string;

  @ApiPropertyOptional({ example: 'prod_diy_001', description: 'Linked product ID' })
  productId?: string;

  @ApiProperty({ example: '2026-11-09T18:00:00.000Z', description: 'Creation timestamp' })
  createdAt!: string;

  @ApiProperty({ example: '2026-11-09T18:45:00.000Z', description: 'Last update timestamp' })
  updatedAt!: string;
}

export class SingleConversationResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: ConversationResponseDto })
  data!: ConversationResponseDto;
}

export class PaginatedConversationsResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: [ConversationResponseDto] })
  data!: ConversationResponseDto[];

  @ApiProperty({
    example: { total: 12, page: 1, limit: 20, totalPages: 1 },
    description: 'Pagination metadata',
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

