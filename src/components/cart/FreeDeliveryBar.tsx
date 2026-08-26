import React from 'react';
import { Truck, CheckCircle2, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';

interface FreeDeliveryBarProps {
  subtotal: number;
}

export function FreeDeliveryBar({ subtotal }: FreeDeliveryBarProps) {
  const threshold = DEFAULT_STORE_CONFIG.freeDeliveryThreshold;
  const isFree = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-primary-50/70 border border-primary-100 rounded-2xl p-3.5 mb-4">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 font-bold text-gray-900">
          {isFree ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">You unlocked FREE Doorstep Delivery!</span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-primary" />
              <span>
                Add <strong className="text-primary">{formatCurrency(remaining)}</strong> more for <strong>FREE Delivery</strong>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold text-primary-800">{percentage}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-white/90 rounded-full h-2 overflow-hidden border border-primary-200/50">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFree ? 'bg-emerald-500' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
