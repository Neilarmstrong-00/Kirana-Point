import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Address, DeliveryCalculationResult } from '@/types';
import { calculateDistance, calculateDeliveryCharge, DEFAULT_STORE_CONFIG } from '@/lib/delivery';

interface CartState {
  items: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  customLocation: { lat: number; lng: number; address: string } | null;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  setCustomLocation: (loc: { lat: number; lng: number; address: string } | null) => void;

  // Computed / Helpers
  getSubtotal: () => number;
  getMrpTotal: () => number;
  getDiscountTotal: () => number;
  getItemCount: () => number;
  getDeliveryCalculation: (customerAddress?: Address | null) => DeliveryCalculationResult;
  getFinalTotal: (customerAddress?: Address | null) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: 'delivery',
      customLocation: null,

      addItem: (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.productId === product.id);

        if (existingIndex >= 0) {
          const updated = [...currentItems];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(newQty, product.stockQuantity),
          };
          set({ items: updated });
        } else {
          const newItem: CartItem = {
            productId: product.id,
            productName: product.name,
            productImage: product.images[0]?.url || '/images/placeholder.svg',
            sellingPrice: product.sellingPrice,
            mrp: product.mrp,
            quantity: Math.min(quantity, product.stockQuantity),
            unit: product.unit,
            unitValue: product.unitValue,
            stockQuantity: product.stockQuantity,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const updated = get().items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
            : item
        );
        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setDeliveryType: (type: 'delivery' | 'pickup') => {
        set({ deliveryType: type });
      },

      setCustomLocation: (loc) => {
        set({ customLocation: loc });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
      },

      getMrpTotal: () => {
        return get().items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
      },

      getDiscountTotal: () => {
        const mrp = get().getMrpTotal();
        const selling = get().getSubtotal();
        return Math.max(0, mrp - selling);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getDeliveryCalculation: (customerAddress?: Address | null) => {
        const { deliveryType, customLocation } = get();
        const subtotal = get().getSubtotal();

        if (deliveryType === 'pickup') {
          return {
            isServiceable: true,
            distanceKm: 0,
            calculatedCharge: 0,
            finalCharge: 0,
            isFreeDelivery: true,
            freeDeliveryReason: 'Store Pickup is always Free',
          };
        }

        let lat = customLocation?.lat || customerAddress?.latitude || DEFAULT_STORE_CONFIG.storeLatitude + 0.02;
        let lng = customLocation?.lng || customerAddress?.longitude || DEFAULT_STORE_CONFIG.storeLongitude + 0.02;

        const distance = calculateDistance(
          DEFAULT_STORE_CONFIG.storeLatitude,
          DEFAULT_STORE_CONFIG.storeLongitude,
          lat,
          lng
        );

        return calculateDeliveryCharge(distance, subtotal, DEFAULT_STORE_CONFIG);
      },

      getFinalTotal: (customerAddress?: Address | null) => {
        const subtotal = get().getSubtotal();
        const delivery = get().getDeliveryCalculation(customerAddress);
        return subtotal + (delivery.isServiceable ? delivery.finalCharge : 0);
      },
    }),
    {
      name: 'kp_cart_state_v1',
    }
  )
);
