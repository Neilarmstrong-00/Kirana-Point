import React from 'react';
import { Truck, Store, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';

export function DeliveryTypePicker() {
  const { deliveryType, setDeliveryType } = useCartStore();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
        Choose Fulfilment Method
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Doorstep Delivery */}
        <button
          type="button"
          onClick={() => setDeliveryType('delivery')}
          className={`p-4 rounded-2xl border text-left transition-all relative flex items-start gap-3.5 ${
            deliveryType === 'delivery'
              ? 'bg-primary-50/50 border-2 border-primary shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              deliveryType === 'delivery'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Truck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Doorstep Delivery</span>
              {deliveryType === 'delivery' && (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Delivered straight to your door in 30-45 mins. ₹5/km (Free above ₹2K).
            </p>
          </div>
        </button>

        {/* Store Pickup */}
        <button
          type="button"
          onClick={() => setDeliveryType('pickup')}
          className={`p-4 rounded-2xl border text-left transition-all relative flex items-start gap-3.5 ${
            deliveryType === 'pickup'
              ? 'bg-primary-50/50 border-2 border-primary shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              deliveryType === 'pickup'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Store className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Self Pickup at Store</span>
              {deliveryType === 'pickup' && (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Ready in ~20 mins at {DEFAULT_STORE_CONFIG.storeName}. Always 100% Free.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
