import { describe, it, expect, beforeEach } from 'vitest';
import { ChatService } from './chat.service.js';
import { MessageType } from './dto/chat-message.dto.js';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    service = new ChatService();
  });

  describe('WebSocket Presence', () => {
    it('should track user online and offline socket states correctly', () => {
      expect(service.isUserOnline('usr_test_1')).toBe(false);

      service.addUserSocket('usr_test_1', 'socket_a');
      expect(service.isUserOnline('usr_test_1')).toBe(true);
      expect(service.getOnlineUserIds()).toContain('usr_test_1');

      service.addUserSocket('usr_test_1', 'socket_b');
      expect(service.isUserOnline('usr_test_1')).toBe(true);

      service.removeUserSocket('usr_test_1', 'socket_a');
      expect(service.isUserOnline('usr_test_1')).toBe(true);

      service.removeUserSocket('usr_test_1', 'socket_b');
      expect(service.isUserOnline('usr_test_1')).toBe(false);
      expect(service.getOnlineUserIds()).not.toContain('usr_test_1');
    });
  });

  describe('Conversations', () => {
    it('should retrieve existing conversations with pagination', async () => {
      const result = await service.getConversations('usr_c001', { page: 1, limit: 10 });
      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.meta.page).toBe(1);
    });

    it('should retrieve single conversation by id', async () => {
      const result = await service.getConversationById('conv_8801', 'usr_c001');
      expect(result.success).toBe(true);
      expect(result.data.id).toBe('conv_8801');
      expect(result.data.participants.length).toBe(2);
    });

    it('should throw NotFoundException if conversation does not exist', async () => {
      await expect(service.getConversationById('conv_non_existent')).rejects.toThrow();
    });

    it('should create a new conversation between participants', async () => {
      const result = await service.createConversation(
        {
          participantIds: ['usr_c002', 'prov_p002'],
          title: 'Special Cake Decor Inquiry',
          initialMessage: 'Do you make gluten-free unicorn cakes?',
        },
        'usr_c002',
      );

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Special Cake Decor Inquiry');
      expect(result.data.lastMessage?.content).toBe('Do you make gluten-free unicorn cakes?');
    });
  });

  describe('Messages', () => {
    it('should retrieve message history of a conversation', async () => {
      const result = await service.getMessages('conv_8801', 'usr_c001');
      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should send a message and update lastMessage on conversation', async () => {
      const sendResult = await service.sendMessage(
        {
          conversationId: 'conv_8801',
          content: 'Test message for vitest test',
          messageType: MessageType.TEXT,
        },
        'usr_c001',
        'Sarah Jenkins',
      );

      expect(sendResult.success).toBe(true);
      expect(sendResult.data.content).toBe('Test message for vitest test');

      const conv = await service.getConversationById('conv_8801', 'usr_c001');
      expect(conv.data.lastMessage?.content).toBe('Test message for vitest test');
    });

    it('should mark messages as read and clear unread counter', async () => {
      const markResult = await service.markAsRead('conv_8801', 'prov_p001');
      expect(markResult.success).toBe(true);

      const unread = await service.getUnreadCount('prov_p001');
      expect(unread.byConversation['conv_8801']).toBeUndefined();
    });

    it('should return unread count breakdown', async () => {
      const unread = await service.getUnreadCount('usr_c002');
      expect(unread.success).toBe(true);
      expect(typeof unread.totalUnreadCount).toBe('number');
    });

    it('should delete a message sent by user', async () => {
      const sent = await service.sendMessage(
        {
          conversationId: 'conv_8801',
          content: 'Message to be deleted',
        },
        'usr_c001',
      );

      const delResult = await service.deleteMessage(sent.data.id, 'usr_c001');
      expect(delResult.success).toBe(true);
    });
  });

  describe('Attachment & Socket Docs', () => {
    it('should upload chat attachment and return CDN url', async () => {
      const result = await service.uploadAttachment({
        fileName: 'theme.png',
        fileType: 'image/png',
        fileSize: 10240,
      });

      expect(result.success).toBe(true);
      expect(result.data.url).toContain('theme.png');
    });

    it('should return complete Socket.IO specification document', () => {
      const docs = service.getSocketDocs();
      expect(docs.success).toBe(true);
      expect(docs.namespace).toBe('/chat');
      expect(docs.clientEvents.length).toBeGreaterThan(0);
      expect(docs.serverEvents.length).toBeGreaterThan(0);
    });
  });
});

