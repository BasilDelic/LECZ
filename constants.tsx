
import { Video, Product, User, UserRole, Sound, Review, ExpoSession, Auction, PitchDeck } from './types';

// Fix: Added missing required properties email, phone, fullName, isEmailVerified, and isProfileComplete to MOCK_USER
export const MOCK_USER: User = {
  id: 'u1',
  username: 'global_manufacture_co',
  displayName: 'Titan Manufacturing',
  fullName: 'Titan Manufacturing Corp',
  email: 'ops@titan-mfg.com',
  phone: '+1-555-0199',
  avatar: 'https://picsum.photos/seed/titan/200',
  role: UserRole.MANUFACTURER,
  storeId: 's1',
  affiliateEarnings: 0,
  totalSales: 850000.00,
  walletBalance: 125400.00,
  isVerified: true,
  isEmailVerified: true,
  isProfileComplete: true,
  ledger: [
    { id: 'tx1', type: 'CREDIT', amount: 45000, description: 'Bulk Order #8821 - Retailer X', timestamp: '2023-10-25T10:00:00Z', verifiedByAI: true },
    { id: 'tx2', type: 'DEBIT', amount: 5000, description: 'Platform Service Fee', timestamp: '2023-10-24T15:30:00Z', verifiedByAI: true }
  ],
  backedPitches: [],
  followingIds: ['u5'], // Titan follows Neural Link by default
  followersCount: 12500,
};

// Additional mock users representing stores for search
// Fix: Added missing required properties email, phone, fullName, isEmailVerified, and isProfileComplete to MOCK_STORES entries
export const MOCK_STORES: User[] = [
  {
    id: 'u5',
    username: 'neural_hardware',
    displayName: 'Neural Link Hardware',
    fullName: 'Neural Link Hardware Systems',
    email: 'info@neural-link.io',
    phone: '+1-555-0210',
    avatar: 'https://picsum.photos/seed/pitch1/100',
    role: UserRole.MANUFACTURER,
    walletBalance: 0,
    ledger: [],
    isVerified: true,
    isEmailVerified: true,
    isProfileComplete: true,
    followingIds: [],
    followersCount: 8900
  },
  {
    id: 'u6',
    username: 'eco_mats',
    displayName: 'EcoMaterials Lab',
    fullName: 'EcoMaterials Research Lab',
    email: 'support@ecomaterials.com',
    phone: '+1-555-0344',
    avatar: 'https://picsum.photos/seed/pitch2/100',
    role: UserRole.MANUFACTURER,
    walletBalance: 0,
    ledger: [],
    isVerified: true,
    isEmailVerified: true,
    isProfileComplete: true,
    followingIds: [],
    followersCount: 4200
  }
];

export const MOCK_PITCHES: PitchDeck[] = [
  {
    id: 'pitch1',
    developerId: 'u5',
    developerName: 'Neural Link Hardware',
    developerAvatar: 'https://picsum.photos/seed/pitch1/100',
    title: 'FocusFrame AI Glasses',
    description: 'Next-gen smart eyewear for B2B industrial workers. Real-time overlay of inventory and manual instructions.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    fundingGoal: 500000,
    currentFunding: 125000,
    equityOffered: 15,
    status: 'FUNDING',
    backers: 12,
    tags: ['Tech', 'Industrial', 'AI']
  },
  {
    id: 'pitch2',
    developerId: 'u6',
    developerName: 'EcoMaterials Lab',
    developerAvatar: 'https://picsum.photos/seed/pitch2/100',
    title: 'Graphene Solar Tiles',
    description: 'Unbreakable solar tiles for warehouse roofing. High efficiency, low weight.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    fundingGoal: 2000000,
    currentFunding: 1850000,
    equityOffered: 10,
    status: 'FUNDING',
    backers: 45,
    tags: ['GreenTech', 'Construction']
  }
];

export const MOCK_AUCTIONS: Auction[] = [
  {
    id: 'bid1',
    productId: 'p1',
    sellerId: 'u1',
    sellerName: 'Titan Manufacturing',
    sellerAvatar: 'https://picsum.photos/seed/titan/100',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    startingPrice: 500,
    minBidIncrement: 50,
    status: 'LIVE',
    type: 'RESTRICTED',
    registeredUserIds: ['dist1'],
    currentHighestBid: { id: 'b1', bidderId: 'dist1', bidderName: 'FastDistro', bidderAvatar: 'https://picsum.photos/seed/dist/100', amount: 650, timestamp: new Date().toISOString() },
    totalBids: 4,
    hostingRoleRequired: [UserRole.MANUFACTURER]
  }
];

export const MOCK_SOUNDS: Sound[] = [
  { id: 'snd1', title: 'Industrial Progress', artist: 'Tech Beats', url: '', thumbnail: '', isLicensed: true }
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://picsum.photos/seed/v1/400/800',
    caption: 'New 2024 Inventory available for Distributors. Inquire now.',
    sellerId: 'u1',
    sellerName: 'Titan Manufacturing',
    sellerAvatar: 'https://picsum.photos/seed/titan/100',
    productId: 'p1',
    soundId: 'snd1',
    likes: 12400,
    comments: 450,
    shares: 890
  }
];

export const MOCK_PRODUCTS: Record<string, Product> = {
  'p1': {
    id: 'p1',
    name: 'Industrial Tablet X-9',
    price: 450.00,
    description: 'Bulk only. Minimum order 50 units. Rugged IP68 certified.',
    image: 'https://picsum.photos/seed/p1/400/400',
    category: 'Electronics',
    variants: ['Rugged Black', 'Steel Grey'],
    sellerId: 'u1',
    shippingInfo: 'Container only.',
    returnPolicy: 'Factory Warranty.',
    avgRating: 4.9,
    reviewCount: 12
  }
};

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'p1': [
    { id: 'r1', rating: 5, comment: 'Excellent build quality.', userName: 'Buyer123' },
    { id: 'r2', rating: 4, comment: 'Very rugged, perfect for field work.', userName: 'B2B_Pro' }
  ]
};

export const MOCK_EXPO_SESSIONS: ExpoSession[] = [];
