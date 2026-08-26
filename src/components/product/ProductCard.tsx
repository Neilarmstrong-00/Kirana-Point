'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useMounted } from '@/hooks/useMounted';
import { StockBadge } from './StockBadge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mounted = useMounted();
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { requireAuth } = useAuthStore();

  const cartItem = items.find((item) => item.productId === product.id);
  const rawQuantityInCart = cartItem?.quantity || 0;
  const quantityInCart = mounted ? rawQuantityInCart : 0;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      requireAuth(() => {
        addItem(product, 1);
      }, `Please sign in or register to add ${product.name} to your cart.`);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart < product.stockQuantity) {
      requireAuth(() => {
        updateQuantity(product.id, quantityInCart + 1);
      });
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantityInCart - 1);
    }
  };

  const imageUrl = product.images[0]?.url || '/images/placeholder.svg';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all overflow-hidden relative">
      {/* Discount & Stock Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.discount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-accent text-white shadow-xs">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="absolute top-2.5 right-2.5 z-10">
        <StockBadge
          stockQuantity={product.stockQuantity}
          lowStockThreshold={product.lowStockThreshold}
        />
      </div>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative w-full pt-[85%] bg-gray-50/50 overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Unit */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500 mb-1 gap-1">
            <span className="font-semibold text-primary uppercase tracking-wider truncate max-w-[80px] sm:max-w-[120px]">
              {product.brand}
            </span>
            <span className="bg-gray-100 font-medium px-1.5 sm:px-2 py-0.5 rounded-md text-gray-700 shrink-0">
              {product.unitValue} {product.unit}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Add to Cart Counter */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-50 flex items-center justify-between gap-1.5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-extrabold text-gray-900">
                {formatCurrency(product.sellingPrice)}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-emerald-600 font-medium">
              Save {formatCurrency(product.mrp - product.sellingPrice)}
            </p>
          </div>

          {/* Add to Cart or Stepper Controls */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gray-100 text-gray-400 text-[10px] sm:text-xs font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : quantityInCart > 0 ? (
              <div className="flex items-center gap-1 bg-primary-50 border border-primary-200 rounded-xl p-0.5">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white text-primary flex items-center justify-center font-bold shadow-xs hover:bg-primary-100 active:scale-95 transition-all"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span className="text-xs font-extrabold text-primary w-4 sm:w-5 text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  disabled={quantityInCart >= product.stockQuantity}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-xs hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all text-xs font-bold shadow-xs shadow-primary/20"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
