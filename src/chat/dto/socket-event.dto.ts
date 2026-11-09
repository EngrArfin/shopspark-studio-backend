import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JoinRoomWsDto {
  @ApiProperty({
    example: 'conv_8801',
    description: 'Conversation room ID to join for realtime updates',
  })
  conversationId!: string;
}

export class LeaveRoomWsDto {
  @ApiProperty({
    example: 'conv_8801',
    description: 'Conversation room ID to leave',
  })
  conversationId!: string;
}

export class SendMessageWsDto {
  @ApiProperty({
    example: 'conv_8801',
    description: 'Target conversation room ID',
  })
  conversationId!: string;

  @ApiProperty({
    example: 'Awesome, can we schedule the party for 3:00 PM?',
    description: 'Message text content',
  })
  content!: string;

  @ApiPropertyOptional({
    example: 'TEXT',
    enum: ['TEXT', 'IMAGE', 'FILE'],
    description: 'Message media category',
  })
  messageType?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
    description: 'Optional URL of attachment',
  })
  attachmentUrl?: string;

  @ApiPropertyOptional({
    example: 'prov_p001',
    description: 'Receiver user ID for dedicated user room alert',
  })
  receiverId?: string;
}

export class TypingWsDto {
  @ApiProperty({ example: 'conv_8801', description: 'Conversation ID' })
  conversationId!: string;

  @ApiProperty({ example: true, description: 'True when user starts typing; false when stopped' })
  isTyping!: boolean;
}

export class MarkReadWsDto {
  @ApiProperty({ example: 'conv_8801', description: 'Conversation ID' })
  conversationId!: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['msg_9901', 'msg_9902'],
    description: 'Message IDs that were read',
  })
  messageIds?: string[];
}

export class SocketEventDetailDto {
  @ApiProperty({ example: 'send_message', description: 'Event identifier' })
  event!: string;

  @ApiProperty({ example: 'CLIENT_TO_SERVER', enum: ['CLIENT_TO_SERVER', 'SERVER_TO_CLIENT'] })
  direction!: string;

  @ApiProperty({ example: 'Dispatched by client to transmit a new chat message into a room.' })
  description!: string;

  @ApiProperty({
    example: {
      conversationId: 'conv_8801',
      content: 'Hello world',
      messageType: 'TEXT',
    },
    description: 'Sample JSON payload',
  })
  samplePayload!: any;
}

export class SocketDocsResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'http://localhost:3000/chat', description: 'Socket.IO Gateway Connection URL' })
  gatewayUrl!: string;

  @ApiProperty({ example: '/chat', description: 'Socket.IO Namespace' })
  namespace!: string;

  @ApiProperty({
    example: ['websocket', 'polling'],
    description: 'Supported transport mechanisms',
    type: [String],
  })
  transports!: string[];

  @ApiProperty({
    example: {
      authHeader: 'Authorization: Bearer <JWT_TOKEN>',
      authPayload: 'socket = io("http://localhost:3000/chat", { auth: { token: "<JWT_TOKEN>" } })',
      queryParam: 'http://localhost:3000/chat?token=<JWT_TOKEN>',
    },
    description: 'Authentication options during Socket handshake',
  })
  authGuidelines!: any;

  @ApiProperty({ type: [SocketEventDetailDto], description: 'All available Client-to-Server events' })
  clientEvents!: SocketEventDetailDto[];

  @ApiProperty({ type: [SocketEventDetailDto], description: 'All available Server-to-Client broadcast events' })
  serverEvents!: SocketEventDetailDto[];

  @ApiProperty({
    example: {
      reactHook: '// React Hook Example...',
      rtkQuerySetup: '// RTK Query integration...',
    },
    description: 'Ready-to-use frontend code snippets for seamless integration',
  })
  codeSamples!: Record<string, string>;
}

