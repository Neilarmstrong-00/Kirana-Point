import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  quantity,
  max,
  onIncrement,
  onDecrement,
  size = 'md',
}: QuantitySelectorProps) {
  const isSm = size === 'sm';

  return (
    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-0.5">
      <button
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={`${
          isSm ? 'w-6 h-6' : 'w-7 h-7'
        } rounded-lg bg-white text-gray-700 flex items-center justify-center font-bold shadow-xs hover:bg-gray-100 active:scale-95 transition-all`}
      >
        {quantity <= 1 ? (
          <Trash2 className="w-3 h-3 text-red-500" />
        ) : (
          <Minus className="w-3 h-3" />
        )}
      </button>
      <span
        className={`${
          isSm ? 'text-[11px] w-4' : 'text-xs w-6'
        } font-extrabold text-gray-900 text-center select-none`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        disabled={quantity >= max}
        className={`${
          isSm ? 'w-6 h-6' : 'w-7 h-7'
        } rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-xs hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
