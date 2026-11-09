import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service.js';
import {
  ConversationQueryDto,
  CreateConversationDto,
  PaginatedConversationsResponseDto,
  SingleConversationResponseDto,
} from './dto/create-conversation.dto.js';
import {
  MarkReadDto,
  MarkReadResponseDto,
  MessageQueryDto,
  PaginatedMessagesResponseDto,
  SendMessageDto,
  SingleMessageResponseDto,
  UnreadCountResponseDto,
} from './dto/chat-message.dto.js';
import {
  AttachmentResponseDto,
  UploadAttachmentDto,
} from './dto/chat-attachment.dto.js';
import { SocketDocsResponseDto } from './dto/socket-event.dto.js';

@ApiTags('Chat & Messaging')
@ApiBearerAuth('JWT-auth')
@Controller(['chat', 'api/chat'])
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  // ==========================================
  // 1. SOCKET.IO WEBSOCKET DOCUMENTATION & SPECS
  // ==========================================
  @Get('socket-docs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Real-Time Socket.IO WebSocket Documentation & Event Specs',
    description: `
Retrieve full developer specifications for the Socket.IO WebSocket connection.
### Connection Guide:
- **Gateway URL**: \`http://localhost:3000/chat\` (Namespace: \`/chat\`)
- **Transports**: \`['websocket', 'polling']\`
- **Auth**: Pass JWT inside \`auth: { token: 'Bearer <TOKEN>' }\` or header \`Authorization\`.

### Available Client Events:
- \`join_conversation\` — Join active room (\`{ conversationId }\`)
- \`leave_conversation\` — Leave room (\`{ conversationId }\`)
- \`send_message\` — Transmit message (\`{ conversationId, content, messageType, attachmentUrl }\`)
- \`typing\` — Emit typing indicator (\`{ conversationId, isTyping: true|false }\`)
- \`mark_read\` — Signal messages read (\`{ conversationId, messageIds }\`)
- \`get_online_users\` — Query currently connected user IDs

### Available Server Events:
- \`new_message\` — Broadcasts incoming chat message in real-time
- \`user_typing\` — Broadcasts participant typing status
- \`messages_read\` — Broadcasts message read receipts
- \`user_status\` — Broadcasts user online/offline status changes
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Socket.IO specifications retrieved successfully.',
    type: SocketDocsResponseDto,
  })
  getSocketDocs(): SocketDocsResponseDto {
    return this.chatService.getSocketDocs();
  }

  // ==========================================
  // 2. CONVERSATIONS MANAGEMENT
  // ==========================================
  @Get('conversations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get All User Conversations (Chat Inbox)',
    description:
      'Retrieve paginated list of chat threads for the authenticated user, including participants info, online indicators, last message snippet, and unread badges.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations list retrieved successfully.',
    type: PaginatedConversationsResponseDto,
  })
  async getConversations(
    @Query() query: ConversationQueryDto,
  ): Promise<PaginatedConversationsResponseDto> {
    return this.chatService.getConversations('usr_c001', query);
  }

  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create or Open Conversation Thread',
    description:
      'Start a new chat conversation or return existing one between participants. Supports linking to Order ID, Quote ID, or Product ID with optional initial message.',
  })
  @ApiBody({ type: CreateConversationDto })
  @ApiResponse({
    status: 201,
    description: 'Conversation created or returned successfully.',
    type: SingleConversationResponseDto,
  })
  async createConversation(
    @Body() dto: CreateConversationDto,
  ): Promise<SingleConversationResponseDto> {
    return this.chatService.createConversation(dto, 'usr_c001');
  }

  @Get('conversations/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Single Conversation Details',
    description: 'Retrieve conversation metadata, participant presence status, and unread count by conversation ID.',
  })
  @ApiParam({ name: 'id', example: 'conv_8801', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation details retrieved successfully.',
    type: SingleConversationResponseDto,
  })
  async getConversationById(
    @Param('id') id: string,
  ): Promise<SingleConversationResponseDto> {
    return this.chatService.getConversationById(id, 'usr_c001');
  }

  // ==========================================
  // 3. MESSAGES HISTORY & TRANSMISSION
  // ==========================================
  @Get('conversations/:id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Conversation Message History',
    description:
      'Retrieve chronologically ordered message thread for a conversation with pagination (page, limit) and optional keyword search.',
  })
  @ApiParam({ name: 'id', example: 'conv_8801', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully.',
    type: PaginatedMessagesResponseDto,
  })
  async getMessages(
    @Param('id') id: string,
    @Query() query: MessageQueryDto,
  ): Promise<PaginatedMessagesResponseDto> {
    return this.chatService.getMessages(id, 'usr_c001', query);
  }

  @Post('conversations/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send Message into Conversation (REST Fallback)',
    description:
      'Post a message via standard HTTP REST API. Automatically updates last message, increments unread counters, and triggers real-time socket broadcast.',
  })
  @ApiParam({ name: 'id', example: 'conv_8801', description: 'Conversation ID' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully.',
    type: SingleMessageResponseDto,
  })
  async sendMessageInConversation(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ): Promise<SingleMessageResponseDto> {
    return this.chatService.sendMessage(
      { ...dto, conversationId: id },
      'usr_c001',
      'Sarah Jenkins',
      'USER',
    );
  }

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send Message Directly (Auto-resolve Conversation)',
    description:
      'Post a message using either conversationId or receiverId. If conversation does not exist, it is created automatically.',
  })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully.',
    type: SingleMessageResponseDto,
  })
  async sendMessageDirect(
    @Body() dto: SendMessageDto,
  ): Promise<SingleMessageResponseDto> {
    return this.chatService.sendMessage(
      dto,
      'usr_c001',
      'Sarah Jenkins',
      'USER',
    );
  }

  // ==========================================
  // 4. READ RECEIPTS & UNREAD BADGES
  // ==========================================
  @Patch('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark Messages in Conversation as Read',
    description:
      'Updates unread counter to 0 for the user in this conversation and marks target message IDs as read.',
  })
  @ApiParam({ name: 'id', example: 'conv_8801', description: 'Conversation ID' })
  @ApiBody({ type: MarkReadDto })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read successfully.',
    type: MarkReadResponseDto,
  })
  async markAsRead(
    @Param('id') id: string,
    @Body() dto: MarkReadDto,
  ): Promise<MarkReadResponseDto> {
    return this.chatService.markAsRead(id, 'usr_c001', dto);
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Total Unread Messages Count',
    description:
      'Retrieve total unread message badge count across all active conversations for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread message counts retrieved successfully.',
    type: UnreadCountResponseDto,
  })
  async getUnreadCount(): Promise<UnreadCountResponseDto> {
    return this.chatService.getUnreadCount('usr_c001');
  }

  // ==========================================
  // 5. ATTACHMENT UPLOAD & MESSAGE MANAGEMENT
  // ==========================================
  @Post('upload-attachment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload Chat Attachment (Images, PDF, Documents)',
    description:
      'Upload file or base64 data for chat attachments. Returns public CDN URL to attach to messages.',
  })
  @ApiBody({ type: UploadAttachmentDto })
  @ApiResponse({
    status: 201,
    description: 'Attachment uploaded successfully.',
    type: AttachmentResponseDto,
  })
  async uploadAttachment(
    @Body() dto: UploadAttachmentDto,
  ): Promise<AttachmentResponseDto> {
    return this.chatService.uploadAttachment(dto);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete or Recall Chat Message',
    description: 'Remove a message from conversation thread (sender or administrator only).',
  })
  @ApiParam({ name: 'id', example: 'msg_9903', description: 'Message ID to delete' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully.',
  })
  async deleteMessage(@Param('id') id: string) {
    return this.chatService.deleteMessage(id, 'usr_c001');
  }
}

