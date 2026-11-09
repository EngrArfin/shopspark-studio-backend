import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export class SendMessageDto {
  @ApiPropertyOptional({
    example: 'conv_8801',
    description: 'Conversation ID. If omitted, receiverId must be supplied to auto-create or find conversation',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiPropertyOptional({
    example: 'prov_p001',
    description: 'Recipient user ID if conversation does not exist yet',
  })
  @IsOptional()
  @IsString()
  receiverId?: string;

  @ApiProperty({
    example: 'Hi! Could you confirm if the party entertainer brings their own sound equipment?',
    description: 'Text content of the message',
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional({
    enum: MessageType,
    default: MessageType.TEXT,
    example: MessageType.TEXT,
    description: 'Type of chat message: TEXT, IMAGE, FILE, or SYSTEM',
  })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType = MessageType.TEXT;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
    description: 'Direct CDN or storage URL for attached media/file',
  })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiPropertyOptional({
    example: 'party-theme-reference.jpg',
    description: 'Original filename of the attachment',
  })
  @IsOptional()
  @IsString()
  attachmentName?: string;

  @ApiPropertyOptional({
    example: 245760,
    description: 'Attachment file size in bytes',
  })
  @IsOptional()
  @IsNumber()
  attachmentSize?: number;
}

export class MessageQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 50, description: 'Messages limit per page', default: 50 })
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({ example: 'sound equipment', description: 'Filter messages containing keyword' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'msg_9901', description: 'Unique message identifier' })
  id!: string;

  @ApiProperty({ example: 'conv_8801', description: 'Conversation ID message belongs to' })
  conversationId!: string;

  @ApiProperty({ example: 'usr_c001', description: 'User ID of sender' })
  senderId!: string;

  @ApiProperty({ example: 'Sarah Jenkins', description: 'Display name of sender' })
  senderName!: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN', 'PROVIDER'], description: 'Sender platform role' })
  senderRole!: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    description: 'Sender avatar URL',
  })
  senderAvatar?: string;

  @ApiProperty({ example: 'Yes, all party sound gear is included!', description: 'Message body' })
  content!: string;

  @ApiProperty({ example: 'TEXT', enum: MessageType, description: 'Message type' })
  messageType!: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
    description: 'Optional attachment link',
  })
  attachmentUrl?: string;

  @ApiPropertyOptional({ example: 'setup.jpg', description: 'Optional attachment filename' })
  attachmentName?: string;

  @ApiPropertyOptional({ example: 120400, description: 'Optional attachment size in bytes' })
  attachmentSize?: number;

  @ApiProperty({ example: true, description: 'Whether the message has been viewed by the recipient' })
  isRead!: boolean;

  @ApiPropertyOptional({ example: '2026-11-09T18:46:00.000Z', description: 'Timestamp when read' })
  readAt?: string;

  @ApiProperty({ example: '2026-11-09T18:45:00.000Z', description: 'Creation timestamp' })
  createdAt!: string;
}

export class SingleMessageResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: MessageResponseDto })
  data!: MessageResponseDto;
}

export class PaginatedMessagesResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ type: [MessageResponseDto] })
  data!: MessageResponseDto[];

  @ApiProperty({
    example: { total: 45, page: 1, limit: 50, totalPages: 1 },
    description: 'Pagination metadata',
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class MarkReadDto {
  @ApiPropertyOptional({
    type: [String],
    example: ['msg_9901', 'msg_9902'],
    description: 'Optional array of message IDs to mark read. If omitted, marks all messages in conversation',
  })
  @IsOptional()
  @IsArray()
  messageIds?: string[];
}

export class MarkReadResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Messages marked as read successfully' })
  message!: string;

  @ApiProperty({ example: 3, description: 'Count of messages updated to read' })
  updatedCount!: number;
}

export class UnreadCountResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 5, description: 'Total unread messages across all conversations' })
  totalUnreadCount!: number;

  @ApiProperty({
    example: { conv_8801: 2, conv_8802: 3 },
    description: 'Breakdown of unread messages per conversation ID',
  })
  byConversation!: Record<string, number>;
}

