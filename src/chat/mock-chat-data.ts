export interface ChatParticipant {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN' | 'PROVIDER';
  isOnline: boolean;
  lastSeenAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'USER' | 'ADMIN' | 'PROVIDER';
  senderAvatar?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  title?: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  lastMessageAt?: string;
  unreadCounts: Record<string, number>; // userId -> unread count
  orderId?: string;
  quoteId?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_8801',
    title: 'Magical Princess Party Booking Inquiry',
    orderId: 'ord_1001',
    quoteId: 'quot_5001',
    createdAt: '2026-11-09T14:00:00.000Z',
    updatedAt: '2026-11-09T18:45:00.000Z',
    lastMessageAt: '2026-11-09T18:45:00.000Z',
    participants: [
      {
        userId: 'usr_c001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'USER',
        isOnline: true,
        lastSeenAt: '2026-11-09T19:00:00.000Z',
      },
      {
        userId: 'prov_p001',
        name: 'Magic Sparkles Entertainment',
        email: 'info@magicsparkles.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'PROVIDER',
        isOnline: true,
        lastSeenAt: '2026-11-09T19:00:00.000Z',
      },
    ],
    unreadCounts: {
      usr_c001: 0,
      prov_p001: 1,
    },
    lastMessage: {
      id: 'msg_9903',
      conversationId: 'conv_8801',
      senderId: 'usr_c001',
      senderName: 'Sarah Jenkins',
      senderRole: 'USER',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      content: 'Could you confirm if the sound system is included for the 3:00 PM slot?',
      messageType: 'TEXT',
      isRead: false,
      createdAt: '2026-11-09T18:45:00.000Z',
    },
  },
  {
    id: 'conv_8802',
    title: 'Custom T-Shirt Artwork Proof Review',
    orderId: 'ord_1002',
    createdAt: '2026-11-08T10:00:00.000Z',
    updatedAt: '2026-11-09T16:20:00.000Z',
    lastMessageAt: '2026-11-09T16:20:00.000Z',
    participants: [
      {
        userId: 'usr_c002',
        name: 'Michael Chang',
        email: 'michael.c@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'USER',
        isOnline: false,
        lastSeenAt: '2026-11-09T16:30:00.000Z',
      },
      {
        userId: 'admin_master',
        name: 'ShopSpark Admin Support',
        email: 'admin@shopspark.com',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'ADMIN',
        isOnline: true,
        lastSeenAt: '2026-11-09T19:00:00.000Z',
      },
    ],
    unreadCounts: {
      usr_c002: 1,
      admin_master: 0,
    },
    lastMessage: {
      id: 'msg_9906',
      conversationId: 'conv_8802',
      senderId: 'admin_master',
      senderName: 'ShopSpark Admin Support',
      senderRole: 'ADMIN',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      content: 'We have updated the dinosaur print proof mockup. Please review the attached PDF.',
      messageType: 'FILE',
      attachmentUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
      attachmentName: 'tshirt-dino-proof-v2.pdf',
      attachmentSize: 450200,
      isRead: false,
      createdAt: '2026-11-09T16:20:00.000Z',
    },
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_9901',
    conversationId: 'conv_8801',
    senderId: 'usr_c001',
    senderName: 'Sarah Jenkins',
    senderRole: 'USER',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: 'Hi! I submitted a quote request for my daughter’s 6th birthday party.',
    messageType: 'TEXT',
    isRead: true,
    readAt: '2026-11-09T14:15:00.000Z',
    createdAt: '2026-11-09T14:05:00.000Z',
  },
  {
    id: 'msg_9902',
    conversationId: 'conv_8801',
    senderId: 'prov_p001',
    senderName: 'Magic Sparkles Entertainment',
    senderRole: 'PROVIDER',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content: 'Hello Sarah! Yes, we received your quote and we are super excited. We offer magic shows and balloon twisting!',
    messageType: 'TEXT',
    isRead: true,
    readAt: '2026-11-09T14:30:00.000Z',
    createdAt: '2026-11-09T14:20:00.000Z',
  },
  {
    id: 'msg_9903',
    conversationId: 'conv_8801',
    senderId: 'usr_c001',
    senderName: 'Sarah Jenkins',
    senderRole: 'USER',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: 'Could you confirm if the sound system is included for the 3:00 PM slot?',
    messageType: 'TEXT',
    isRead: false,
    createdAt: '2026-11-09T18:45:00.000Z',
  },
  {
    id: 'msg_9904',
    conversationId: 'conv_8802',
    senderId: 'usr_c002',
    senderName: 'Michael Chang',
    senderRole: 'USER',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content: 'Hello, could we enlarge the custom dinosaur graphic on the chest?',
    messageType: 'TEXT',
    isRead: true,
    readAt: '2026-11-08T11:00:00.000Z',
    createdAt: '2026-11-08T10:10:00.000Z',
  },
  {
    id: 'msg_9905',
    conversationId: 'conv_8802',
    senderId: 'admin_master',
    senderName: 'ShopSpark Admin Support',
    senderRole: 'ADMIN',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    content: 'Sure Michael! Our graphic design team is re-scaling the vector graphic right now.',
    messageType: 'TEXT',
    isRead: true,
    readAt: '2026-11-08T11:30:00.000Z',
    createdAt: '2026-11-08T11:15:00.000Z',
  },
  {
    id: 'msg_9906',
    conversationId: 'conv_8802',
    senderId: 'admin_master',
    senderName: 'ShopSpark Admin Support',
    senderRole: 'ADMIN',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    content: 'We have updated the dinosaur print proof mockup. Please review the attached PDF.',
    messageType: 'FILE',
    attachmentUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
    attachmentName: 'tshirt-dino-proof-v2.pdf',
    attachmentSize: 450200,
    isRead: false,
    createdAt: '2026-11-09T16:20:00.000Z',
  },
];

