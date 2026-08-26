import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

import { useRouter } from 'next/navigation';

import { useMounted } from '@/hooks/useMounted';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const router = useRouter();
  const mounted = useMounted();
  const { items, deliveryType, getSubtotal, getMrpTotal, getDiscountTotal, getDeliveryCalculation, getFinalTotal } =
    useCartStore();
  const { addresses, selectedAddressId, requireAuth } = useAuthStore();

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || null;

  const subtotal = getSubtotal();
  const mrpTotal = getMrpTotal();
  const discountTotal = getDiscountTotal();
  const deliveryResult = getDeliveryCalculation(selectedAddress);
  const finalTotal = getFinalTotal(selectedAddress);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      router.push('/checkout');
    }, 'Please sign in or register to proceed to checkout.');
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
        Order Summary
      </h3>

      {/* Breakdown */}
      <div className="space-y-2.5 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Items Total (MRP)</span>
          <span className="text-gray-900 font-medium">{formatCurrency(mrpTotal)}</span>
        </div>

        {discountTotal > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Product Discounts</span>
            </span>
            <span>-{formatCurrency(discountTotal)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span>Delivery Fee</span>
            {deliveryType === 'delivery' && deliveryResult.distanceKm > 0 && (
              <span className="block text-[10px] text-gray-400">
                ({deliveryResult.distanceKm} km from store)
              </span>
            )}
          </div>
          <div>
            {deliveryType === 'pickup' ? (
              <span className="font-bold text-emerald-600">FREE (Pickup)</span>
            ) : deliveryResult.isFreeDelivery ? (
              <span className="font-bold text-emerald-600">FREE</span>
            ) : (
              <span className="font-medium text-gray-900">
                {formatCurrency(deliveryResult.finalCharge)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
        <div>
          <span className="text-sm font-bold text-gray-900">Grand Total</span>
          <span className="block text-[10px] text-gray-500">Inclusive of all taxes</span>
        </div>
        <span className="text-xl font-extrabold text-primary">
          {formatCurrency(finalTotal)}
        </span>
      </div>

      {/* Checkout CTA */}
      {showCheckoutButton && (
        <button
          type="button"
          onClick={handleCheckoutClick}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-4 rounded-xl font-bold text-sm hover:bg-primary-dark active:scale-[0.99] transition-all shadow-md shadow-primary/20"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span>Safe & Secure UPI / Cash on Delivery Checkout</span>
      </div>
    </div>
  );
}
