'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, userClaimPaid, updateOrderStatus, getStoreConfig } from '@/lib/firestore';
import { generatePaymentLinks, UPILinkParams } from '@/lib/upi';
import { Order, StoreConfig } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { UPIAppButtons } from '@/components/payment/UPIAppButtons';
import { QRCodeDisplay } from '@/components/payment/QRCodeDisplay';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Banknote,
  ArrowRight,
  Clock,
  Store,
} from 'lucide-react';

export default function UPIPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [ord, conf] = await Promise.all([getOrderById(orderId), getStoreConfig()]);
      setOrder(ord);
      setConfig(conf);
      setLoading(false);
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-500">
        Loading payment details...
      </div>
    );
  }

  if (!order || !config) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Order Not Found</h2>
        <Link href="/" className="text-xs font-bold text-primary hover:underline">
          ← Return to Store
        </Link>
      </div>
    );
  }

  const paymentParams: UPILinkParams = {
    upiId: config.upiId,
    payeeName: config.upiDisplayName || config.storeName,
    amount: order.total,
    orderNumber: order.orderNumber,
    note: `Order ${order.orderNumber}`,
  };

  const links = generatePaymentLinks(paymentParams);

  const handleClaimPaid = async () => {
    setClaiming(true);
    try {
      await userClaimPaid(order.id);
      router.push(`/orders/${order.id}/verifying`);
    } catch (err) {
      console.error('Error claiming paid:', err);
      alert('Error updating payment status. Please try again.');
      setClaiming(false);
    }
  };

  const handleSwitchToCod = async () => {
    if (confirm('Switch this order to Cash on Delivery (COD)?')) {
      await updateOrderStatus(order.id, 'confirmed', order.userName, 'Switched payment method to COD');
      router.push(`/orders/${order.id}/confirmed`);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary flex items-center justify-center mx-auto shadow-xs">
          <CreditCard className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Complete UPI Payment</h1>
        <p className="text-xs text-gray-500">
          Order <strong>{order.orderNumber}</strong> • 100% Direct Store Transfer
        </p>
      </div>

      {/* Bill & Payee Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Pay To</span>
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-primary" />
              {config.upiDisplayName || config.storeName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Amount</span>
            <span className="text-xl font-extrabold text-primary">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Store UPI ID: <strong className="text-gray-800 font-mono">{config.upiId}</strong></span>
          <span className="text-[11px] text-emerald-600 font-semibold">Zero Fee</span>
        </div>
      </div>

      {/* Payment Options: Direct App Buttons */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Option 1: Pay using UPI App on your phone
        </h3>
        <UPIAppButtons links={links} amount={order.total} />
      </div>

      {/* Payment Options: QR Code for Desktop */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Option 2: Scan QR Code with Phone Camera / Scanner
        </h3>
        <QRCodeDisplay qrData={links.qrData} upiId={config.upiId} amount={order.total} />
      </div>

      {/* After Payment Claim CTA */}
      <div className="bg-gradient-to-br from-emerald-50 to-primary-50 rounded-3xl border border-emerald-200 p-5 shadow-xs space-y-3 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Completed payment in your UPI app?</span>
        </div>

        <button
          type="button"
          onClick={handleClaimPaid}
          disabled={claiming}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{claiming ? 'Submitting Verification...' : '✅ I Have Completed the Payment'}</span>
        </button>

        <p className="text-[11px] text-gray-500 leading-relaxed">
          The store manager will verify receipt in their UPI app and confirm your order shortly.
        </p>
      </div>

      {/* Fallback to COD */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleSwitchToCod}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Prefer to pay Cash on Delivery instead?</span>
        </button>
      </div>
    </div>
  );
}
