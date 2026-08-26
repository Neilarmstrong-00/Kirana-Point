export type Role = 'customer' | 'admin' | 'staff';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isVerified: boolean;
  avatarUrl?: string;
  defaultAddressId?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  fullAddress: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface ProductNutrition {
  energy?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
}

export interface PriceComparison {
  bigbasket?: number;
  blinkit?: number;
  zepto?: number;
  jiomart?: number;
  fetchedAt?: string;
}

export interface ProductImage {
  url: string;
  githubPath?: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export type ProductUnit = 'kg' | 'g' | 'L' | 'mL' | 'pcs' | 'pack' | 'dozen';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  description: string;
  brand: string;
  barcode?: string;
  ingredients?: string;
  nutritionInfo?: ProductNutrition;
  mrp: number;
  sellingPrice: number;
  discount: number; // percentage
  priceComparison?: PriceComparison;
  unit: ProductUnit;
  unitValue: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured?: boolean;
  isDailyDeal?: boolean;
  images: ProductImage[];
  tags: string[];
  searchKeywords?: string;
  createdAt: string;
  updatedAt: string;
  autoFilledAt?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  sellingPrice: number;
  mrp: number;
  quantity: number;
  unit: ProductUnit;
  unitValue: number;
  stockQuantity: number;
  addedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_verifying'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'delivered'
  | 'picked_up'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi';

export type PaymentStatus =
  | 'pending'
  | 'awaiting_verification'
  | 'verified'
  | 'rejected'
  | 'refunded';

export interface OrderItem {
  productId: string;
  productNameSnapshot: string;
  productImageSnapshot: string;
  priceSnapshot: number;
  mrpSnapshot: number;
  quantity: number;
  unit: string;
  unitValue: number;
  lineTotal: number;
}

export interface DeliveryDetail {
  storeLat: number;
  storeLng: number;
  customerLat: number;
  customerLng: number;
  distanceKm: number;
  chargePerKm: number;
  calculatedCharge: number;
  finalCharge: number;
  isFreeDelivery: boolean;
  freeDeliveryReason?: string;
  estimatedDelivery?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  deliveryType: 'delivery' | 'pickup';
  addressSnapshot?: Address;
  deliveryDetail?: DeliveryDetail;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  upiTransactionRef?: string;
  whatsappSent: boolean;
  whatsappSentAt?: string;
  notes?: string;
  placedAt: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone?: string;
  method: PaymentMethod;
  upiId: string;
  amount: number;
  upiDeepLink: string;
  status: 'pending' | 'user_claimed_paid' | 'admin_verified' | 'admin_rejected' | 'refunded';
  userClaimedAt?: string;
  adminVerifiedAt?: string;
  adminVerifiedBy?: string;
  upiTransactionRef?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreConfig {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  storeLatitude: number;
  storeLongitude: number;
  deliveryRatePerKm: number;
  freeDeliveryThreshold: number;
  maxDeliveryRadiusKm: number;
  minOrderAmount: number;
  minDeliveryCharge: number;
  operatingHours: string;
  isStoreOpen: boolean;
  upiId: string;
  upiDisplayName: string;
  whatsappNumber: string;
  whatsappAutoMessage: boolean;
  updatedAt: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  action: 'order_placed' | 'order_cancelled' | 'restock' | 'adjustment';
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  reason: string;
  performedBy: string;
  orderId?: string;
  createdAt: string;
}

export interface DeliveryCalculationResult {
  isServiceable: boolean;
  distanceKm: number;
  calculatedCharge: number;
  finalCharge: number;
  isFreeDelivery: boolean;
  freeDeliveryReason?: string;
  amountForFreeDelivery?: number;
  message?: string;
}
