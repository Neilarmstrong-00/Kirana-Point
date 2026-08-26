'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getOrderById } from '@/lib/firestore';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  Truck,
  Store,
  MessageSquare,
  ArrowRight,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';
import { generateCustomerSupportLink } from '@/lib/whatsapp';

export default function OrderConfirmedPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrderById(orderId).then(setOrder);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D7A3A', '#FF8F00', '#16A34A', '#E8F5E9'],
      });
    } catch (e) {
      // ignore
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        Loading confirmation...
      </div>
    );
  }

  const supportUrl = generateCustomerSupportLink(DEFAULT_STORE_CONFIG.storePhone, order.orderNumber);

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Order Confirmed!</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900">
            Thank you, {order.userName.split(' ')[0]}!
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Order <strong>{order.orderNumber}</strong> has been registered with our store team.
          </p>
        </div>

        {/* Estimated Time Card */}
        <div className="bg-gradient-to-br from-primary-50 to-emerald-50/50 p-4 rounded-2xl border border-primary-100 flex items-center gap-3.5 text-left">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
            {order.deliveryType === 'delivery' ? (
              <Truck className="w-5 h-5" />
            ) : (
              <Store className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              {order.deliveryType === 'delivery'
                ? 'Estimated Delivery: 30–45 mins'
                : 'Ready for Pickup in ~20 mins'}
            </span>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {order.deliveryType === 'delivery'
                ? `Delivering to: ${order.addressSnapshot?.fullAddress || 'Selected Address'}`
                : `Store Counter: ${DEFAULT_STORE_CONFIG.storeAddress}`}
            </p>
          </div>
        </div>

        {/* Items Brief */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-2 text-left">
          <div className="flex justify-between font-bold text-gray-900 border-b border-gray-200/60 pb-2">
            <span>Summary ({order.items.length} items)</span>
            <span className="text-primary font-extrabold">{formatCurrency(order.total)}</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-[11px]">
                <span className="truncate max-w-[200px]">
                  {item.productNameSnapshot} × {item.quantity}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200/60 flex justify-between text-[11px] text-gray-500">
            <span>Payment Mode:</span>
            <span className="font-bold text-gray-800 uppercase">
              {order.paymentMethod === 'upi' ? 'UPI (Paid & Verified)' : 'Cash on Delivery (COD)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href={`/orders/${order.id}`}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Track Order & View Live Status</span>
          </Link>

          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message Store on WhatsApp</span>
          </a>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
