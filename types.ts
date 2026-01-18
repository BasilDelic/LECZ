
export enum UserRole {
  ADMIN = 'ADMIN',
  OPS_ASSISTANT = 'OPS_ASSISTANT',
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  RETAILER = 'RETAILER',
  CONSUMER = 'CONSUMER'
}

export enum OrderStatus {
  INQUIRY = 'INQUIRY',
  SHIPPING_DISCUSSION = 'SHIPPING_DISCUSSION',
  SHIPPING_PROPOSED = 'SHIPPING_PROPOSED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED'
}

export interface WalletLedgerEntry {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  timestamp: string;
  verifiedByAI: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  fullName: string;
  avatar: string;
  role: UserRole;
  gender?: string;
  age?: number;
  businessName?: string;
  businessAddress?: string;
  registrationNumber?: string;
  hasValidatedLocation?: boolean;
  storeId?: string;
  affiliateEarnings?: number;
  totalSales?: number;
  walletBalance: number;
  ledger: WalletLedgerEntry[];
  isVerified: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  backedPitches?: string[];
  followingIds: string[];
  followersCount: number;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  productPrice: number;
  shippingCost?: number;
  quantity: number;
  status: OrderStatus;
  variant?: string;
  timestamp: string;
}

export interface PitchDeck {
  id: string;
  developerId: string;
  developerName: string;
  developerAvatar: string;
  title: string;
  description: string;
  videoUrl: string;
  fundingGoal: number;
  currentFunding: number;
  equityOffered: number;
  status: 'PENDING' | 'FUNDING' | 'FUNDED' | 'PRODUCTION';
  backers: number;
  tags: string[];
}

export interface BulkTier {
  minQuantity: number;
  pricePerUnit: number;
}

export interface VariantDetail {
  price: number;
  stockStatus: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; 
  description: string;
  image: string;
  category: string;
  variants: string[];
  variantDetails?: Record<string, VariantDetail>;
  sellerId: string;
  shippingInfo: string;
  returnPolicy: string;
  avgRating: number;
  reviewCount: number;
  affiliateCommission?: number;
  bulkPricing?: BulkTier[];
  isPitchOriginated?: boolean;
}

export interface BidEntry {
  id: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar: string;
  amount: number;
  timestamp: string;
}

export interface Auction {
  id: string;
  productId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  startTime: string;
  endTime: string;
  startingPrice: number;
  minBidIncrement: number;
  status: 'UPCOMING' | 'LIVE' | 'ENDED';
  type: 'OPEN' | 'RESTRICTED';
  registeredUserIds: string[];
  currentHighestBid?: BidEntry;
  totalBids: number;
  hostingRoleRequired?: UserRole[];
}

export interface Sound {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail: string;
  isLicensed: boolean;
}

export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  productId: string;
  soundId: string;
  likes: number;
  comments: number;
  shares: number;
  sellerRole?: UserRole;
}

export interface ExpoSession {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  title: string;
  viewerCount: number;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
  category: 'PRODUCT_LAUNCH' | 'AFFILIATE_TRAINING' | 'B2B_MEETING' | 'LIVE_SALE' | 'PRODUCT_MARKETING' | 'PRODUCT_REVIEW';
  featuredProductId?: string;
}
