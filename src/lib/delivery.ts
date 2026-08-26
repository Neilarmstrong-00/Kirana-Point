import { DeliveryCalculationResult } from '@/types';

export const DEFAULT_STORE_CONFIG = {
  storeName: process.env.NEXT_PUBLIC_STORE_NAME || 'Kirana Point',
  storePhone: process.env.NEXT_PUBLIC_STORE_PHONE || '918208232735',
  storeEmail: 'pratham@kiranapoint.com',
  storeAddress: process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Main Road, Khamgaon, Dist. Buldhana, Maharashtra 444303',
  storeLatitude: parseFloat(process.env.NEXT_PUBLIC_STORE_LAT || '20.6865'),
  storeLongitude: parseFloat(process.env.NEXT_PUBLIC_STORE_LNG || '76.5654'),
  deliveryRatePerKm: parseFloat(process.env.NEXT_PUBLIC_DELIVERY_RATE_PER_KM || '5'),
  freeDeliveryThreshold: parseFloat(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || '2000'),
  maxDeliveryRadiusKm: parseFloat(process.env.NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM || '15'),
  minDeliveryCharge: parseFloat(process.env.NEXT_PUBLIC_MIN_DELIVERY_CHARGE || '20'),
  minOrderAmount: 100,
  operatingHours: '7:00 AM – 10:00 PM',
  isStoreOpen: true,
  upiId: process.env.NEXT_PUBLIC_STORE_UPI_ID || '8208232735@axl',
  upiDisplayName: 'Pratham Tarde (Kirana Point)',
  whatsappNumber: process.env.NEXT_PUBLIC_STORE_PHONE || '918208232735',
  whatsappAutoMessage: true,
  updatedAt: new Date().toISOString(),
};

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculates distance in kilometers between two coordinates using the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculates delivery fee based on distance and order subtotal
 */
export function calculateDeliveryCharge(
  distanceKm: number,
  subtotal: number,
  config = DEFAULT_STORE_CONFIG
): DeliveryCalculationResult {
  if (distanceKm > config.maxDeliveryRadiusKm) {
    return {
      isServiceable: false,
      distanceKm,
      calculatedCharge: 0,
      finalCharge: 0,
      isFreeDelivery: false,
      message: `Delivery is not available beyond ${config.maxDeliveryRadiusKm} km from our store.`,
    };
  }

  const calculated = Math.max(distanceKm * config.deliveryRatePerKm, config.minDeliveryCharge);

  if (subtotal >= config.freeDeliveryThreshold) {
    return {
      isServiceable: true,
      distanceKm,
      calculatedCharge: Math.round(calculated),
      finalCharge: 0,
      isFreeDelivery: true,
      freeDeliveryReason: `Free delivery on orders above ₹${config.freeDeliveryThreshold}`,
    };
  }

  const amountForFree = config.freeDeliveryThreshold - subtotal;

  return {
    isServiceable: true,
    distanceKm,
    calculatedCharge: Math.round(calculated),
    finalCharge: Math.round(calculated),
    isFreeDelivery: false,
    amountForFreeDelivery: amountForFree > 0 ? amountForFree : 0,
  };
}
