'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, subscribeToDocument } from '@/lib/firestore';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  Loader2,
  Store,
  MessageSquare,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';
import { generateCustomerSupportLink } from '@/lib/whatsapp';

export default function PaymentVerifyingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Initial fetch
    getOrderById(orderId).then((ord) => {
      setOrder(ord);
      if (ord && (ord.status === 'confirmed' || ord.paymentStatus === 'verified')) {
        router.push(`/orders/${ord.id}/confirmed`);
      }
    });

    // Reactive live subscription
    const unsubscribe = subscribeToDocument<Order>('kp_orders_v1', orderId, (updated) => {
      if (updated) {
        setOrder(updated);
        if (updated.status === 'confirmed' || updated.paymentStatus === 'verified') {
          router.push(`/orders/${updated.id}/confirmed`);
        }
      }
    });

    return () => unsubscribe();
  }, [orderId, router]);

  const supportLink = generateCustomerSupportLink(DEFAULT_STORE_CONFIG.storePhone, order?.orderNumber);

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 pb-16">
      {/* Animated Waiting Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm text-center space-y-4">
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center animate-pulse">
            <Clock className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </div>

        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            Payment Verification in Progress
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Order <strong>{order?.orderNumber || '...'}</strong> • Amount: <strong>{formatCurrency(order?.total || 0)}</strong>
          </p>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
          The store owner is checking their UPI app for your payment receipt. This usually takes <strong>3–8 minutes</strong> during operating hours.
        </p>

        {/* Live Stepper */}
        <div className="text-left bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Order Placed & Registered</span>
          </div>

          <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>UPI Payment Claim Submitted</span>
          </div>

          <div className="flex items-center gap-2.5 text-amber-700 font-bold">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
            <span>Store Admin Verifying Transaction (Live...)</span>
          </div>

          <div className="flex items-center gap-2.5 text-gray-400">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
            <span>Order Confirmed & Preparation Begins</span>
          </div>
        </div>

        {/* Support & Actions */}
        <div className="space-y-2 pt-2">
          <a
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Need Help? WhatsApp Store Directly</span>
          </a>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            <span>Continue Browsing Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        This screen updates automatically in real-time when the admin verifies your payment.
      </p>
    </div>
  );
}
