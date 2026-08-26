import React from 'react';
import { Truck, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DeliveryCalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';

interface DeliveryChargeCardProps {
  deliveryResult: DeliveryCalculationResult;
  deliveryType: 'delivery' | 'pickup';
}

export function DeliveryChargeCard({ deliveryResult, deliveryType }: DeliveryChargeCardProps) {
  if (deliveryType === 'pickup') {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3 text-xs">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-emerald-900 block">Self Store Pickup Selected</span>
          <p className="text-emerald-700 text-[11px] mt-0.5">
            Your items will be packed and ready for pickup at our store in ~20 minutes. Zero delivery fee!
          </p>
        </div>
      </div>
    );
  }

  if (!deliveryResult.isServiceable) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-xs">
        <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-red-900 block">Delivery Not Available</span>
          <p className="text-red-700 text-[11px] mt-0.5">
            {deliveryResult.message || `Distance is ${deliveryResult.distanceKm} km. Maximum delivery radius is ${DEFAULT_STORE_CONFIG.maxDeliveryRadiusKm} km.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Distance & Delivery Pricing</h4>
            <p className="text-[10px] text-gray-500">
              Haversine calculated: {deliveryResult.distanceKm} km from store
            </p>
          </div>
        </div>

        <div>
          {deliveryResult.isFreeDelivery ? (
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
              FREE DELIVERY
            </span>
          ) : (
            <span className="text-xs font-extrabold text-gray-900">
              {formatCurrency(deliveryResult.finalCharge)}
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Standard Delivery Rate:</span>
          <span className="font-semibold text-gray-800">
            ₹{DEFAULT_STORE_CONFIG.deliveryRatePerKm}/km (Min ₹{DEFAULT_STORE_CONFIG.minDeliveryCharge})
          </span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Distance:</span>
          <span className="font-semibold text-gray-800">{deliveryResult.distanceKm} km</span>
        </div>
        {deliveryResult.isFreeDelivery && (
          <p className="text-emerald-700 font-bold pt-1 border-t border-gray-200/60">
            🎉 Qualified for Free Doorstep Delivery! (Order &gt; ₹{DEFAULT_STORE_CONFIG.freeDeliveryThreshold})
          </p>
        )}
      </div>
    </div>
  );
}
