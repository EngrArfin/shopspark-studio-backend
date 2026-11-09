import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import {
  JoinRoomWsDto,
  LeaveRoomWsDto,
  MarkReadWsDto,
  SendMessageWsDto,
  TypingWsDto,
} from './dto/socket-event.dto.js';
import { MessageType } from './dto/chat-message.dto.js';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('🚀 Socket.IO Chat Gateway successfully initialized on namespace /chat');
  }

  handleConnection(client: Socket) {
    const userId = this.extractUserId(client);
    this.logger.log(`🟢 Socket connected: ${client.id} (User: ${userId})`);

    // Store socket mapping and presence
    this.chatService.addUserSocket(userId, client.id);

    // Join personal notification room
    client.join(`user_${userId}`);

    // Broadcast online status to platform
    this.server.emit('user_status', {
      userId,
      isOnline: true,
      lastSeenAt: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    const userId = this.extractUserId(client);
    this.logger.log(`🔴 Socket disconnected: ${client.id} (User: ${userId})`);

    this.chatService.removeUserSocket(userId, client.id);

    if (!this.chatService.isUserOnline(userId)) {
      this.server.emit('user_status', {
        userId,
        isOnline: false,
        lastSeenAt: new Date().toISOString(),
      });
    }
  }

  // ==========================================
  // WEBSOCKET CLIENT-TO-SERVER EVENT LISTENERS
  // ==========================================

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomWsDto,
  ) {
    if (!data?.conversationId) return;
    const roomName = `conv_${data.conversationId}`;
    client.join(roomName);
    this.logger.log(`User ${client.id} joined room ${roomName}`);

    return {
      event: 'joined_room',
      status: 'success',
      conversationId: data.conversationId,
    };
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LeaveRoomWsDto,
  ) {
    if (!data?.conversationId) return;
    const roomName = `conv_${data.conversationId}`;
    client.leave(roomName);
    this.logger.log(`User ${client.id} left room ${roomName}`);

    return {
      event: 'left_room',
      status: 'success',
      conversationId: data.conversationId,
    };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageWsDto,
  ) {
    try {
      const senderId = this.extractUserId(client);
      const senderRole = this.extractUserRole(client);
      const senderName = this.extractUserName(client);

      const msgResult = await this.chatService.sendMessage(
        {
          conversationId: data.conversationId,
          receiverId: data.receiverId,
          content: data.content,
          messageType: (data.messageType as MessageType) || MessageType.TEXT,
          attachmentUrl: data.attachmentUrl,
        },
        senderId,
        senderName,
        senderRole,
      );

      const createdMessage = msgResult.data;
      const roomName = `conv_${createdMessage.conversationId}`;

      // Broadcast to all participants in this conversation room
      this.server.to(roomName).emit('new_message', createdMessage);

      // Also deliver personal notification to receiver if specified
      if (data.receiverId) {
        this.server.to(`user_${data.receiverId}`).emit('new_message_notification', {
          conversationId: createdMessage.conversationId,
          message: createdMessage,
        });
      }

      return {
        status: 'success',
        data: createdMessage,
      };
    } catch (error: any) {
      this.logger.error(`Failed to handle send_message: ${error.message}`);
      return {
        status: 'error',
        message: error.message || 'Failed to send message',
      };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TypingWsDto,
  ) {
    if (!data?.conversationId) return;
    const senderId = this.extractUserId(client);
    const senderName = this.extractUserName(client);
    const roomName = `conv_${data.conversationId}`;

    // Broadcast to others in the room
    client.to(roomName).emit('user_typing', {
      conversationId: data.conversationId,
      userId: senderId,
      name: senderName,
      isTyping: !!data.isTyping,
    });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MarkReadWsDto,
  ) {
    if (!data?.conversationId) return;
    const userId = this.extractUserId(client);

    await this.chatService.markAsRead(data.conversationId, userId, {
      messageIds: data.messageIds,
    });

    const roomName = `conv_${data.conversationId}`;
    client.to(roomName).emit('messages_read', {
      conversationId: data.conversationId,
      readerId: userId,
      readAt: new Date().toISOString(),
    });

    return {
      status: 'success',
      conversationId: data.conversationId,
    };
  }

  @SubscribeMessage('get_online_users')
  handleGetOnlineUsers() {
    return {
      status: 'success',
      onlineUserIds: this.chatService.getOnlineUserIds(),
    };
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================
  private extractUserId(client: Socket): string {
    const auth = client.handshake.auth;
    const headers = client.handshake.headers;
    const query = client.handshake.query;

    if (auth?.userId) return String(auth.userId);
    if (query?.userId) return String(query.userId);

    // If client supplied JWT token, extract payload if possible or fallback
    const token = auth?.token || headers.authorization || query?.token;
    if (typeof token === 'string' && token.includes('.')) {
      try {
        const parts = token.replace('Bearer ', '').split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload?.sub || payload?.userId || payload?.id) {
            return String(payload.sub || payload.userId || payload.id);
          }
        }
      } catch {
        // Fallback below
      }
    }

    return client.id ? `usr_${client.id.substring(0, 6)}` : 'usr_c001';
  }

  private extractUserRole(client: Socket): 'USER' | 'ADMIN' | 'PROVIDER' {
    const auth = client.handshake.auth;
    if (auth?.role) return auth.role;
    return 'USER';
  }

  private extractUserName(client: Socket): string {
    const auth = client.handshake.auth;
    if (auth?.name) return auth.name;
    return 'ShopSpark User';
  }
}

