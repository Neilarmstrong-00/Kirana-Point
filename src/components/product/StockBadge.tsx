import React from 'react';

interface StockBadgeProps {
  stockQuantity: number;
  lowStockThreshold?: number;
}

export function StockBadge({ stockQuantity, lowStockThreshold = 5 }: StockBadgeProps) {
  if (stockQuantity <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
        Out of Stock
      </span>
    );
  }

  if (stockQuantity <= lowStockThreshold) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
        Only {stockQuantity} left!
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
      In Stock
    </span>
  );
}
