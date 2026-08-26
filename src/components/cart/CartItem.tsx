import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { QuantitySelector } from './QuantitySelector';
import { useCartStore } from '@/stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    if (item.quantity < item.stockQuantity) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity <= 1) {
      removeItem(item.productId);
    } else {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const lineTotal = item.sellingPrice * item.quantity;
  const mrpTotal = item.mrp * item.quantity;

  return (
    <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
      {/* Product Image & Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={item.productImage || '/images/placeholder.svg'}
          alt={item.productName}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {item.productName}
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {item.unitValue} {item.unit} • {formatCurrency(item.sellingPrice)} / item
          </p>
          <div className="flex items-baseline gap-1.5 mt-1 sm:hidden">
            <span className="text-xs font-bold text-gray-900">
              {formatCurrency(lineTotal)}
            </span>
            {mrpTotal > lineTotal && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatCurrency(mrpTotal)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="shrink-0 flex items-center gap-3 sm:gap-6">
        <QuantitySelector
          quantity={item.quantity}
          max={item.stockQuantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />

        {/* Line Total on Desktop */}
        <div className="text-right hidden sm:block w-20">
          <p className="text-sm font-extrabold text-gray-900">{formatCurrency(lineTotal)}</p>
          {mrpTotal > lineTotal && (
            <p className="text-[11px] text-gray-400 line-through">
              {formatCurrency(mrpTotal)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
