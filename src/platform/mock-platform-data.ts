import { QuoteResponseDto } from './dto/quotes.dto.js';
import { PartyGenerationResponseDto } from './dto/party-generation.dto.js';
import { TaskDto } from './dto/tasks.dto.js';
import { WishlistItemDto } from './dto/wishlist.dto.js';
import { PlanDto } from './dto/provider-plan.dto.js';
import { InvitationDto } from './dto/invitations.dto.js';

export const INITIAL_QUOTES: QuoteResponseDto[] = [
  {
    id: 'quote-101',
    providerId: 'prv-1',
    userId: 'usr-2',
    providerName: 'Royal Party Balloons & Decor',
    totalPrice: 250,
    status: 'BOOKED',
    date: '2026-11-20',
    location: 'Paris 75001',
    createdAt: '2026-10-24T12:00:00.000Z',
  },
  {
    id: 'quote-102',
    providerId: 'prv-2',
    userId: 'usr-3',
    providerName: 'London Kids Entertainment & Magic',
    totalPrice: 320,
    status: 'PENDING',
    date: '2026-11-25',
    location: 'London NW1 6XE',
    createdAt: '2026-10-23T15:30:00.000Z',
  },
];

export const INITIAL_PARTY_PLANS: PartyGenerationResponseDto[] = [
  {
    id: 'plan-101',
    title: 'Leo’s 7th Safari Adventure Birthday',
    scheduledDate: '2026-11-28',
    totalInvitation: 12,
    totalInvitationConfirm: 10,
    totalPendingInvitaion: 2,
    totalInvitationCancel: 0,
    sections: [
      {
        name: 'Decorations & Tableware',
        items: [
          { description: 'Green tropical leaf table runners and wooden plates', sortOrder: 1 },
          { description: 'Safari animal balloon archway at entry', sortOrder: 2 },
        ],
      },
      {
        name: 'Fun Games & Activities',
        items: [
          { description: 'Wild animal scavenger hunt in the garden', sortOrder: 1 },
          { description: 'DIY safari animal mask crafting workshop', sortOrder: 2 },
        ],
      },
    ],
    timelineEvents: [
      { time: '14:00', description: 'Guest arrivals and welcome jungle juice bar', sortOrder: 1 },
      { time: '14:45', description: 'Scavenger hunt activity begins', sortOrder: 2 },
      { time: '16:00', description: 'Safari birthday cake presentation', sortOrder: 3 },
    ],
    suggestedGifts: [{ productId: 'prod-001' }],
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
];

export const INITIAL_TASKS: TaskDto[] = [
  {
    id: 'task-1',
    name: 'Order custom birthday cake from local bakery',
    isComplete: true,
    category: 'Food & Drinks',
    priority: 'HIGH',
    dueDate: '2026-11-22',
    daysAhead: 3,
    userId: 'usr-2',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-22T14:00:00.000Z',
  },
  {
    id: 'task-2',
    name: 'Send digital party invitation cards to classmates',
    isComplete: true,
    category: 'Invitations',
    priority: 'HIGH',
    dueDate: '2026-11-20',
    daysAhead: 1,
    userId: 'usr-2',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-21T09:30:00.000Z',
  },
  {
    id: 'task-3',
    name: 'Prepare DIY craft kits and table mats',
    isComplete: false,
    category: 'Crafts & Setup',
    priority: 'MEDIUM',
    dueDate: '2026-11-27',
    daysAhead: 8,
    userId: 'usr-2',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
];

export const INITIAL_WISHLIST: WishlistItemDto[] = [
  {
    id: 'fav-1',
    prodcut: {
      id: 'prod-001',
      title: 'Safari Adventure Explorer DIY Party Box',
      price: 49.99,
      discounted_price: 39.99,
      description: 'Complete DIY party craft box with animal masks and binoculars.',
      imges: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'],
    },
  },
];

export const INITIAL_PROVIDER_PLANS: PlanDto[] = [
  {
    id: 'plan-basic',
    name: 'Starter Vendor',
    price: 19.0,
    interval: 'MONTHLY',
    description: 'Perfect for local balloon decorators and independent entertainers.',
    features: ['10 Quote Bids / Month', 'Storefront Listing', 'Direct Customer Chat'],
    isPopular: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'plan-pro',
    name: 'Pro Vendor Membership',
    price: 49.0,
    interval: 'MONTHLY',
    description: 'Our most popular plan for established party companies & caterers.',
    features: ['Unlimited Quote Bids', 'Verified Vendor Badge', 'Priority Client Matching', 'Featured Directory Placement'],
    isPopular: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export const INITIAL_INVITATIONS: InvitationDto[] = [
  {
    id: 'inv-101',
    status: 'CONFIRMED',
    email: 'lucas.dupont@example.fr',
    guest_name: 'Lucas Dupont',
    guest_phone: '+33 6 44 55 66 77',
    party_id: 'plan-101',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
    invitationToken: 'tok_inv_98412_lucas',
    createdAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-10-23T11:00:00.000Z',
  },
];

