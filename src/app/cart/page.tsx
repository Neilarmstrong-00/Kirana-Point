'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useMounted } from '@/hooks/useMounted';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { FreeDeliveryBar } from '@/components/cart/FreeDeliveryBar';
import { ShoppingBag, ArrowLeft, Trash2, Home, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const mounted = useMounted();
  const { items, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  const cartItems = mounted ? items : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">Shopping Cart</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Your Grocery Cart
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {cartItems.length > 0
              ? `Review your ${cartItems.length} selected item${cartItems.length !== 1 ? 's' : ''} before checkout`
              : 'Your cart is currently empty'}
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold p-2 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary-50 text-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Your cart is empty</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Looks like you haven’t added any groceries to your cart yet. Explore our fresh vegetables, staples, and daily essentials!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl font-bold text-xs hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
          >
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start">
          {/* Left 2 Cols: Free Delivery Bar & Items List */}
          <div className="lg:col-span-2 space-y-3">
            <FreeDeliveryBar subtotal={subtotal} />

            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Adding Items</span>
              </Link>
            </div>
          </div>

          {/* Right Col: Summary */}
          <div className="lg:col-span-1 sticky top-24">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
