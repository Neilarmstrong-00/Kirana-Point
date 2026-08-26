import {
  Category,
  Product,
  Order,
  Payment,
  StoreConfig,
  StockLog,
  User,
  Address,
  OrderStatus,
  PaymentStatus,
} from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './seed-data';
import { DEFAULT_STORE_CONFIG } from './delivery';

// In-browser / In-memory storage cache keys
const STORAGE_KEYS = {
  PRODUCTS: 'kp_products_v1',
  CATEGORIES: 'kp_categories_v1',
  ORDERS: 'kp_orders_v1',
  PAYMENTS: 'kp_payments_v1',
  STORE_CONFIG: 'kp_config_v1',
  STOCK_LOGS: 'kp_stock_logs_v1',
  USERS: 'kp_users_v1',
};

// Event listener registry for live subscriptions
type Listener<T> = (data: T) => void;
const listeners: Record<string, Set<Listener<any>>> = {};

function notifyListeners(collection: string, data: any) {
  if (listeners[collection]) {
    listeners[collection].forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error(`Error notifying listener for ${collection}:`, err);
      }
    });
  }
}

export function subscribeToCollection<T>(
  collectionKey: string,
  callback: Listener<T[]>
): () => void {
  if (!listeners[collectionKey]) {
    listeners[collectionKey] = new Set();
  }
  listeners[collectionKey].add(callback);

  // Trigger initial call
  if (typeof window !== 'undefined') {
    const initialData = getCollectionData<T>(collectionKey);
    callback(initialData);
  }

  return () => {
    listeners[collectionKey]?.delete(callback);
  };
}

export function subscribeToDocument<T>(
  collectionKey: string,
  docId: string,
  callback: Listener<T | null>
): () => void {
  const handler = (items: (T & { id: string })[]) => {
    const found = items.find((item) => item.id === docId) || null;
    callback(found);
  };

  if (!listeners[collectionKey]) {
    listeners[collectionKey] = new Set();
  }
  listeners[collectionKey].add(handler);

  // Initial emit
  if (typeof window !== 'undefined') {
    const items = getCollectionData<T & { id: string }>(collectionKey);
    const found = items.find((item) => item.id === docId) || null;
    callback(found);
  }

  return () => {
    listeners[collectionKey]?.delete(handler);
  };
}

function getCollectionData<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    if (key === STORAGE_KEYS.PRODUCTS) return INITIAL_PRODUCTS as any;
    if (key === STORAGE_KEYS.CATEGORIES) return INITIAL_CATEGORIES as any;
    return [];
  }
  const item = localStorage.getItem(key);
  if (!item) {
    if (key === STORAGE_KEYS.PRODUCTS) {
      localStorage.setItem(key, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS as any;
    }
    if (key === STORAGE_KEYS.CATEGORIES) {
      localStorage.setItem(key, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES as any;
    }
    if (key === STORAGE_KEYS.STORE_CONFIG) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_STORE_CONFIG));
      return DEFAULT_STORE_CONFIG as any;
    }
    return [];
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return [];
  }
}

function setCollectionData<T>(key: string, data: T[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
  notifyListeners(key, data);
}

// ----------------- PRODUCTS -----------------
export async function getProducts(): Promise<Product[]> {
  return getCollectionData<Product>(STORAGE_KEYS.PRODUCTS);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    products.unshift({
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  setCollectionData(STORAGE_KEYS.PRODUCTS, products);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  setCollectionData(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
}

// ----------------- CATEGORIES -----------------
export async function getCategories(): Promise<Category[]> {
  return getCollectionData<Category>(STORAGE_KEYS.CATEGORIES);
}

export async function saveCategory(category: Category): Promise<Category> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  setCollectionData(STORAGE_KEYS.CATEGORIES, categories);
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  setCollectionData(STORAGE_KEYS.CATEGORIES, filtered);
  return true;
}

// ----------------- ORDERS -----------------
export async function getOrders(): Promise<Order[]> {
  return getCollectionData<Order>(STORAGE_KEYS.ORDERS);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter((o) => o.userId === userId);
}

export async function createOrder(order: Order): Promise<Order> {
  const orders = await getOrders();
  orders.unshift(order);
  setCollectionData(STORAGE_KEYS.ORDERS, orders);

  // Deduct stock
  const products = await getProducts();
  const logs = getCollectionData<StockLog>(STORAGE_KEYS.STOCK_LOGS);

  order.items.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      const before = prod.stockQuantity;
      prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      logs.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        productId: prod.id,
        productName: prod.name,
        action: 'order_placed',
        quantityChange: -item.quantity,
        stockBefore: before,
        stockAfter: prod.stockQuantity,
        reason: `Order ${order.orderNumber}`,
        performedBy: order.userName,
        orderId: order.id,
        createdAt: new Date().toISOString(),
      });
    }
  });

  setCollectionData(STORAGE_KEYS.PRODUCTS, products);
  setCollectionData(STORAGE_KEYS.STOCK_LOGS, logs);

  // Create payment record if UPI
  if (order.paymentMethod === 'upi') {
    const config = await getStoreConfig();
    const payments = getCollectionData<Payment>(STORAGE_KEYS.PAYMENTS);
    const paymentRecord: Payment = {
      id: `pay_${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      userName: order.userName,
      userPhone: order.userPhone,
      method: 'upi',
      upiId: config.upiId,
      amount: order.total,
      upiDeepLink: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    payments.unshift(paymentRecord);
    setCollectionData(STORAGE_KEYS.PAYMENTS, payments);
  }

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  changedBy = 'Admin',
  note?: string
): Promise<Order | null> {
  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  if (newStatus === 'delivered' || newStatus === 'picked_up') {
    order.deliveredAt = new Date().toISOString();
  }

  order.statusHistory.push({
    status: newStatus,
    changedAt: new Date().toISOString(),
    changedBy,
    note,
  });

  // If order is cancelled, restore stock
  if (newStatus === 'cancelled') {
    const products = await getProducts();
    const logs = getCollectionData<StockLog>(STORAGE_KEYS.STOCK_LOGS);
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const before = prod.stockQuantity;
        prod.stockQuantity += item.quantity;
        logs.unshift({
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          productId: prod.id,
          productName: prod.name,
          action: 'order_cancelled',
          quantityChange: item.quantity,
          stockBefore: before,
          stockAfter: prod.stockQuantity,
          reason: `Order ${order.orderNumber} cancelled`,
          performedBy: changedBy,
          orderId: order.id,
          createdAt: new Date().toISOString(),
        });
      }
    });
    setCollectionData(STORAGE_KEYS.PRODUCTS, products);
    setCollectionData(STORAGE_KEYS.STOCK_LOGS, logs);
  }

  setCollectionData(STORAGE_KEYS.ORDERS, orders);
  return order;
}

// ----------------- PAYMENTS -----------------
export async function getPayments(): Promise<Payment[]> {
  return getCollectionData<Payment>(STORAGE_KEYS.PAYMENTS);
}

export async function userClaimPaid(orderId: string): Promise<Payment | null> {
  const payments = await getPayments();
  const payment = payments.find((p) => p.orderId === orderId);
  if (payment) {
    payment.status = 'user_claimed_paid';
    payment.userClaimedAt = new Date().toISOString();
    payment.updatedAt = new Date().toISOString();
    setCollectionData(STORAGE_KEYS.PAYMENTS, payments);
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = 'payment_verifying';
    order.paymentStatus = 'awaiting_verification';
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'payment_verifying',
      changedAt: new Date().toISOString(),
      changedBy: order.userName,
      note: 'User claimed UPI payment completed',
    });
    setCollectionData(STORAGE_KEYS.ORDERS, orders);
  }

  return payment || null;
}

export async function verifyPayment(
  orderId: string,
  adminUid: string,
  upiTransactionRef?: string
): Promise<{ order: Order | null; payment: Payment | null }> {
  const payments = await getPayments();
  const payment = payments.find((p) => p.orderId === orderId);
  if (payment) {
    payment.status = 'admin_verified';
    payment.adminVerifiedAt = new Date().toISOString();
    payment.adminVerifiedBy = adminUid;
    payment.upiTransactionRef = upiTransactionRef;
    payment.updatedAt = new Date().toISOString();
    setCollectionData(STORAGE_KEYS.PAYMENTS, payments);
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = 'confirmed';
    order.paymentStatus = 'verified';
    order.upiTransactionRef = upiTransactionRef;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'confirmed',
      changedAt: new Date().toISOString(),
      changedBy: 'Admin',
      note: `UPI Payment verified${upiTransactionRef ? ` (Ref: ${upiTransactionRef})` : ''}`,
    });
    setCollectionData(STORAGE_KEYS.ORDERS, orders);
  }

  return { order: order || null, payment: payment || null };
}

export async function rejectPayment(
  orderId: string,
  adminUid: string,
  rejectionReason: string
): Promise<{ order: Order | null; payment: Payment | null }> {
  const payments = await getPayments();
  const payment = payments.find((p) => p.orderId === orderId);
  if (payment) {
    payment.status = 'admin_rejected';
    payment.rejectionReason = rejectionReason;
    payment.updatedAt = new Date().toISOString();
    setCollectionData(STORAGE_KEYS.PAYMENTS, payments);
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = 'awaiting_payment';
    order.paymentStatus = 'rejected';
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'awaiting_payment',
      changedAt: new Date().toISOString(),
      changedBy: 'Admin',
      note: `Payment rejected: ${rejectionReason}`,
    });
    setCollectionData(STORAGE_KEYS.ORDERS, orders);
  }

  return { order: order || null, payment: payment || null };
}

// ----------------- STOCK RESTOCK & LOGS -----------------
export async function getStockLogs(): Promise<StockLog[]> {
  return getCollectionData<StockLog>(STORAGE_KEYS.STOCK_LOGS);
}

export async function restockProduct(
  productId: string,
  quantityToAdd: number,
  performedBy = 'Admin',
  reason = 'Inventory restock'
): Promise<Product | null> {
  const products = await getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const stockBefore = product.stockQuantity;
  product.stockQuantity += quantityToAdd;
  product.updatedAt = new Date().toISOString();
  setCollectionData(STORAGE_KEYS.PRODUCTS, products);

  const logs = await getStockLogs();
  logs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    productId: product.id,
    productName: product.name,
    action: 'restock',
    quantityChange: quantityToAdd,
    stockBefore,
    stockAfter: product.stockQuantity,
    reason,
    performedBy,
    createdAt: new Date().toISOString(),
  });
  setCollectionData(STORAGE_KEYS.STOCK_LOGS, logs);

  return product;
}

// ----------------- STORE CONFIG -----------------
export async function getStoreConfig(): Promise<StoreConfig> {
  if (typeof window === 'undefined') return DEFAULT_STORE_CONFIG;
  const config = localStorage.getItem(STORAGE_KEYS.STORE_CONFIG);
  if (!config) {
    localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(DEFAULT_STORE_CONFIG));
    return DEFAULT_STORE_CONFIG;
  }
  try {
    return JSON.parse(config);
  } catch (e) {
    return DEFAULT_STORE_CONFIG;
  }
}

export async function updateStoreConfig(newConfig: Partial<StoreConfig>): Promise<StoreConfig> {
  const current = await getStoreConfig();
  const updated: StoreConfig = {
    ...current,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(updated));
  }
  notifyListeners(STORAGE_KEYS.STORE_CONFIG, updated);
  return updated;
}
