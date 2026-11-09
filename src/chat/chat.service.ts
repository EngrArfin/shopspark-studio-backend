import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ChatConversation,
  ChatMessage,
  ChatParticipant,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
} from './mock-chat-data.js';
import {
  ConversationQueryDto,
  ConversationResponseDto,
  CreateConversationDto,
  PaginatedConversationsResponseDto,
  SingleConversationResponseDto,
} from './dto/create-conversation.dto.js';
import {
  MarkReadDto,
  MarkReadResponseDto,
  MessageQueryDto,
  MessageResponseDto,
  MessageType,
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

@Injectable()
export class ChatService {
  private conversations: ChatConversation[] = JSON.parse(
    JSON.stringify(INITIAL_CONVERSATIONS),
  );
  private messages: ChatMessage[] = JSON.parse(
    JSON.stringify(INITIAL_MESSAGES),
  );

  // Track connected active socket user IDs
  private onlineUsers = new Map<string, Set<string>>(); // userId -> Set of socketIds

  // ==========================================
  // WEBSOCKET PRESENCE TRACKING
  // ==========================================
  addUserSocket(userId: string, socketId: string): void {
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId)!.add(socketId);
    this.updateParticipantOnlineStatus(userId, true);
  }

  removeUserSocket(userId: string, socketId: string): void {
    const userSockets = this.onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.onlineUsers.delete(userId);
        this.updateParticipantOnlineStatus(userId, false);
      }
    }
  }

  isUserOnline(userId: string): boolean {
    return (this.onlineUsers.get(userId)?.size ?? 0) > 0;
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  private updateParticipantOnlineStatus(userId: string, isOnline: boolean): void {
    const now = new Date().toISOString();
    for (const conv of this.conversations) {
      for (const p of conv.participants) {
        if (p.userId === userId) {
          p.isOnline = isOnline;
          p.lastSeenAt = now;
        }
      }
    }
  }

  // ==========================================
  // CONVERSATIONS MANAGEMENT
  // ==========================================
  async getConversations(
    userId = 'usr_c001',
    query: ConversationQueryDto = {},
  ): Promise<PaginatedConversationsResponseDto> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search?.trim().toLowerCase();

    let list = this.conversations.filter((c) =>
      c.participants.some((p) => p.userId === userId),
    );

    // If no matching conversations for this user, return all conversations as admin/fallback view
    if (list.length === 0) {
      list = [...this.conversations];
    }

    if (search) {
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(search) ||
          c.participants.some((p) => p.name.toLowerCase().includes(search)),
      );
    }

    // Sort by latest message descending
    list.sort((a, b) => {
      const dateA = new Date(a.lastMessageAt || a.updatedAt).getTime();
      const dateB = new Date(b.lastMessageAt || b.updatedAt).getTime();
      return dateB - dateA;
    });

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paged = list.slice(startIndex, startIndex + limit);

    const formatted: ConversationResponseDto[] = paged.map((c) => ({
      id: c.id,
      title: c.title,
      participants: c.participants.map((p) => ({
        ...p,
        isOnline: this.isUserOnline(p.userId) || p.isOnline,
      })),
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      unreadCount: c.unreadCounts[userId] || 0,
      orderId: c.orderId,
      quoteId: c.quoteId,
      productId: c.productId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return {
      success: true,
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getConversationById(
    id: string,
    userId = 'usr_c001',
  ): Promise<SingleConversationResponseDto> {
    const conversation = this.conversations.find((c) => c.id === id);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found.`);
    }

    return {
      success: true,
      data: {
        ...conversation,
        unreadCount: conversation.unreadCounts[userId] || 0,
        participants: conversation.participants.map((p) => ({
          ...p,
          isOnline: this.isUserOnline(p.userId) || p.isOnline,
        })),
      },
    };
  }

  async createConversation(
    dto: CreateConversationDto,
    creatorId = 'usr_c001',
  ): Promise<SingleConversationResponseDto> {
    const participantIds = Array.from(new Set([creatorId, ...dto.participantIds]));

    // Check for existing conversation with exact participants and orderId/quoteId
    const existing = this.conversations.find((c) => {
      const cIds = c.participants.map((p) => p.userId).sort().join(',');
      const reqIds = participantIds.slice().sort().join(',');
      const sameOrder = !dto.orderId || c.orderId === dto.orderId;
      const sameQuote = !dto.quoteId || c.quoteId === dto.quoteId;
      return cIds === reqIds && sameOrder && sameQuote;
    });

    if (existing) {
      if (dto.initialMessage) {
        await this.sendMessage(
          {
            conversationId: existing.id,
            content: dto.initialMessage,
          },
          creatorId,
        );
      }
      return this.getConversationById(existing.id, creatorId);
    }

    const now = new Date().toISOString();
    const newId = `conv_${Date.now()}`;

    // Build participants
    const participants: ChatParticipant[] = participantIds.map((uid) => {
      if (uid === 'admin_master') {
        return {
          userId: uid,
          name: 'ShopSpark Support',
          email: 'support@shopspark.com',
          role: 'ADMIN',
          isOnline: true,
          lastSeenAt: now,
        };
      }
      if (uid.startsWith('prov_')) {
        return {
          userId: uid,
          name: 'Party Specialist',
          email: `${uid}@providers.shopspark.com`,
          role: 'PROVIDER',
          isOnline: false,
          lastSeenAt: now,
        };
      }
      return {
        userId: uid,
        name: uid === creatorId ? 'Current Customer' : `User ${uid}`,
        email: `${uid}@users.shopspark.com`,
        role: 'USER',
        isOnline: true,
        lastSeenAt: now,
      };
    });

    const unreadCounts: Record<string, number> = {};
    participantIds.forEach((pid) => {
      unreadCounts[pid] = 0;
    });

    const newConversation: ChatConversation = {
      id: newId,
      title: dto.title || `Chat with ${participants.filter((p) => p.userId !== creatorId).map((p) => p.name).join(', ') || 'Support'}`,
      participants,
      unreadCounts,
      orderId: dto.orderId,
      quoteId: dto.quoteId,
      productId: dto.productId,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };

    this.conversations.unshift(newConversation);

    if (dto.initialMessage) {
      await this.sendMessage(
        {
          conversationId: newId,
          content: dto.initialMessage,
        },
        creatorId,
      );
    }

    return this.getConversationById(newId, creatorId);
  }

  // ==========================================
  // MESSAGES MANAGEMENT
  // ==========================================
  async getMessages(
    conversationId: string,
    userId = 'usr_c001',
    query: MessageQueryDto = {},
  ): Promise<PaginatedMessagesResponseDto> {
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found.`);
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const search = query.search?.trim().toLowerCase();

    let list = this.messages.filter((m) => m.conversationId === conversationId);

    if (search) {
      list = list.filter((m) => m.content.toLowerCase().includes(search));
    }

    list.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paged = list.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paged,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async sendMessage(
    dto: SendMessageDto,
    senderId = 'usr_c001',
    senderName?: string,
    senderRole: 'USER' | 'ADMIN' | 'PROVIDER' = 'USER',
    senderAvatar?: string,
  ): Promise<SingleMessageResponseDto> {
    if (!dto.content?.trim() && !dto.attachmentUrl) {
      throw new BadRequestException('Message content or attachment URL is required.');
    }

    let conversationId = dto.conversationId;

    if (!conversationId) {
      if (!dto.receiverId) {
        throw new BadRequestException('Either conversationId or receiverId must be supplied.');
      }
      const convResult = await this.createConversation(
        { participantIds: [dto.receiverId] },
        senderId,
      );
      conversationId = convResult.data.id;
    }

    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found.`);
    }

    // Resolve sender details if not provided
    const participant = conversation.participants.find((p) => p.userId === senderId);
    const resolvedName = senderName || participant?.name || 'Authorized User';
    const resolvedRole = senderRole || participant?.role || 'USER';
    const resolvedAvatar = senderAvatar || participant?.avatarUrl;

    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      conversationId,
      senderId,
      senderName: resolvedName,
      senderRole: resolvedRole,
      senderAvatar: resolvedAvatar,
      content: dto.content?.trim() || '',
      messageType: dto.messageType || MessageType.TEXT,
      attachmentUrl: dto.attachmentUrl,
      attachmentName: dto.attachmentName,
      attachmentSize: dto.attachmentSize,
      isRead: false,
      createdAt: now,
    };

    this.messages.push(newMsg);

    // Update conversation state
    conversation.lastMessage = newMsg;
    conversation.lastMessageAt = now;
    conversation.updatedAt = now;

    // Increment unread counts for all participants except sender
    for (const p of conversation.participants) {
      if (p.userId !== senderId) {
        conversation.unreadCounts[p.userId] = (conversation.unreadCounts[p.userId] || 0) + 1;
      }
    }

    return {
      success: true,
      data: newMsg,
    };
  }

  async markAsRead(
    conversationId: string,
    userId = 'usr_c001',
    dto: MarkReadDto = {},
  ): Promise<MarkReadResponseDto> {
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found.`);
    }

    const now = new Date().toISOString();
    let updatedCount = 0;

    for (const m of this.messages) {
      if (m.conversationId === conversationId && m.senderId !== userId && !m.isRead) {
        if (!dto.messageIds || dto.messageIds.includes(m.id)) {
          m.isRead = true;
          m.readAt = now;
          updatedCount++;
        }
      }
    }

    // Reset unread count for user in this conversation
    conversation.unreadCounts[userId] = 0;

    return {
      success: true,
      message: 'Messages marked as read successfully',
      updatedCount,
    };
  }

  async getUnreadCount(userId = 'usr_c001'): Promise<UnreadCountResponseDto> {
    let totalUnreadCount = 0;
    const byConversation: Record<string, number> = {};

    for (const c of this.conversations) {
      if (c.participants.some((p) => p.userId === userId)) {
        const count = c.unreadCounts[userId] || 0;
        if (count > 0) {
          totalUnreadCount += count;
          byConversation[c.id] = count;
        }
      }
    }

    return {
      success: true,
      totalUnreadCount,
      byConversation,
    };
  }

  async deleteMessage(
    messageId: string,
    userId = 'usr_c001',
  ): Promise<{ success: boolean; message: string }> {
    const idx = this.messages.findIndex((m) => m.id === messageId);
    if (idx === -1) {
      throw new NotFoundException(`Message ${messageId} not found.`);
    }

    const msg = this.messages[idx];
    if (msg.senderId !== userId && userId !== 'admin_master') {
      throw new BadRequestException('You are not authorized to delete this message.');
    }

    this.messages.splice(idx, 1);
    return {
      success: true,
      message: 'Message deleted successfully.',
    };
  }

  async uploadAttachment(dto: UploadAttachmentDto): Promise<AttachmentResponseDto> {
    // Generate secure mock attachment URL preserving original sanitized filename
    const sanitized = dto.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fakeCdnUrl = `https://storage.shopspark.com/chat-attachments/${Date.now()}-${sanitized}`;

    return {
      success: true,
      data: {
        url: fakeCdnUrl,
        fileName: dto.fileName,
        fileType: dto.fileType,
        fileSize: dto.fileSize,
      },
    };
  }

  // ==========================================
  // SWAGGER WEBSOCKET PLAYGROUND & SPECS
  // ==========================================
  getSocketDocs(): SocketDocsResponseDto {
    return {
      success: true,
      gatewayUrl: 'http://localhost:3000/chat',
      namespace: '/chat',
      transports: ['websocket', 'polling'],
      authGuidelines: {
        method1_authObject: {
          description: 'Pass JWT inside Socket.IO connection auth payload (Recommended for Web & React)',
          code: `const socket = io("http://localhost:3000/chat", {
  auth: {
    token: "Bearer YOUR_JWT_TOKEN",
    userId: "usr_c001"
  },
  transports: ["websocket"]
});`,
        },
        method2_headers: {
          description: 'Pass Authorization header during handshake',
          code: `const socket = io("http://localhost:3000/chat", {
  extraHeaders: {
    Authorization: "Bearer YOUR_JWT_TOKEN"
  }
});`,
        },
        method3_query: {
          description: 'Pass JWT token as URL query parameter',
          code: `const socket = io("http://localhost:3000/chat?token=YOUR_JWT_TOKEN");`,
        },
      },
      clientEvents: [
        {
          event: 'join_conversation',
          direction: 'CLIENT_TO_SERVER',
          description: 'Client joins a specific conversation room to receive real-time messages & typing alerts.',
          samplePayload: { conversationId: 'conv_8801' },
        },
        {
          event: 'leave_conversation',
          direction: 'CLIENT_TO_SERVER',
          description: 'Client leaves the active conversation room when navigating away.',
          samplePayload: { conversationId: 'conv_8801' },
        },
        {
          event: 'send_message',
          direction: 'CLIENT_TO_SERVER',
          description: 'Client sends a new message into the conversation room. The server persists the message and broadcasts `new_message` to room participants.',
          samplePayload: {
            conversationId: 'conv_8801',
            content: 'Hello, could you confirm the party entertainer availability?',
            messageType: 'TEXT',
            attachmentUrl: null,
            receiverId: 'prov_p001',
          },
        },
        {
          event: 'typing',
          direction: 'CLIENT_TO_SERVER',
          description: 'Broadcasts a typing indicator to other room participants.',
          samplePayload: { conversationId: 'conv_8801', isTyping: true },
        },
        {
          event: 'mark_read',
          direction: 'CLIENT_TO_SERVER',
          description: 'Signals that the client has viewed incoming messages in the room.',
          samplePayload: {
            conversationId: 'conv_8801',
            messageIds: ['msg_9903'],
          },
        },
      ],
      serverEvents: [
        {
          event: 'new_message',
          direction: 'SERVER_TO_CLIENT',
          description: 'Broadcast to all room members whenever someone posts a message in the conversation.',
          samplePayload: {
            id: 'msg_9907',
            conversationId: 'conv_8801',
            senderId: 'usr_c001',
            senderName: 'Sarah Jenkins',
            content: 'Hello! I need assistance with our event booking.',
            messageType: 'TEXT',
            isRead: false,
            createdAt: '2026-11-09T19:15:00.000Z',
          },
        },
        {
          event: 'user_typing',
          direction: 'SERVER_TO_CLIENT',
          description: 'Broadcast to room members when a participant starts or stops typing.',
          samplePayload: {
            conversationId: 'conv_8801',
            userId: 'usr_c001',
            name: 'Sarah Jenkins',
            isTyping: true,
          },
        },
        {
          event: 'messages_read',
          direction: 'SERVER_TO_CLIENT',
          description: 'Broadcast when a recipient marks messages as read.',
          samplePayload: {
            conversationId: 'conv_8801',
            readerId: 'prov_p001',
            readAt: '2026-11-09T19:16:00.000Z',
          },
        },
        {
          event: 'user_status',
          direction: 'SERVER_TO_CLIENT',
          description: 'Broadcast when a user connects (online) or disconnects (offline).',
          samplePayload: {
            userId: 'usr_c001',
            isOnline: true,
            lastSeenAt: '2026-11-09T19:15:00.000Z',
          },
        },
      ],
      codeSamples: {
        reactHook: `import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useChatSocket(conversationId: string, token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    const s = io('http://localhost:3000/chat', {
      auth: { token },
      transports: ['websocket'],
    });

    s.on('connect', () => {
      s.emit('join_conversation', { conversationId });
    });

    s.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on('user_typing', (data) => {
      if (data.conversationId === conversationId) {
        setIsTyping(data.isTyping);
      }
    });

    setSocket(s);

    return () => {
      s.emit('leave_conversation', { conversationId });
      s.disconnect();
    };
  }, [conversationId, token]);

  const sendMessage = (content: string) => {
    socket?.emit('send_message', { conversationId, content });
  };

  return { messages, sendMessage, isTyping };
}`,
        rtkQuerySetup: `// In your chatApi.ts, establish base REST endpoints and inject WebSocket listeners
export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (params) => ({ url: '/chat/conversations', params }),
      providesTags: ['Conversations'],
    }),
    getMessages: builder.query({
      query: ({ conversationId, params }) => ({
        url: \`/chat/conversations/\${conversationId}/messages\`,
        params,
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
      ],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Real-time socket message append can be connected here!
      },
    }),
  }),
});`,
      },
    };
  }
}
