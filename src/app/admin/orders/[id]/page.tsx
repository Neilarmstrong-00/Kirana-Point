'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  rejectPayment,
  getStoreConfig,
} from '@/lib/firestore';
import { Order, StoreConfig, OrderStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusPipeline } from '@/components/admin/OrderStatusPipeline';
import { PaymentVerifyCard } from '@/components/admin/PaymentVerifyCard';
import { WhatsAppPanel } from '@/components/admin/WhatsAppPanel';
import {
  ArrowLeft,
  Truck,
  Store,
  Printer,
  ShieldCheck,
  User as UserIcon,
  Phone,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [ord, conf] = await Promise.all([getOrderById(orderId), getStoreConfig()]);
    setOrder(ord);
    setConfig(conf);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Order Not Found</h2>
        <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await updateOrderStatus(order.id, newStatus, 'Store Admin');
    loadData();
  };

  const handleVerifyPayment = async (refId?: string) => {
    await verifyPayment(order.id, 'admin', refId);
    loadData();
  };

  const handleRejectPayment = async (reason: string) => {
    await rejectPayment(order.id, 'admin', reason);
    loadData();
  };

  const handlePrint = () => {
    window.print();
  };

  const isAwaitingVerification =
    order.paymentMethod === 'upi' &&
    (order.status === 'payment_verifying' || order.paymentStatus === 'awaiting_verification');

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Placed on {formatDate(order.placedAt || order.createdAt)}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="p-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-2 shadow-2xs self-start"
        >
          <Printer className="w-4 h-4" />
          <span>Print Kitchen Invoice</span>
        </button>
      </div>

      {/* Priority UPI Verification Card if needed */}
      {isAwaitingVerification && (
        <PaymentVerifyCard
          orderNumber={order.orderNumber}
          customerName={order.userName}
          customerPhone={order.userPhone}
          amount={order.total}
          upiId={config?.upiId || 'kiranapoint@upi'}
          userClaimedAt={order.updatedAt}
          onVerify={handleVerifyPayment}
          onReject={handleRejectPayment}
        />
      )}

      {/* Status Pipeline */}
      <OrderStatusPipeline
        currentStatus={order.status}
        deliveryType={order.deliveryType}
        onStatusChange={handleStatusChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Order Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Items to Pack ({order.items.length})
            </h3>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImageSnapshot || '/images/placeholder.svg'}
                      alt={item.productNameSnapshot}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        {item.productNameSnapshot}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.quantity} × {formatCurrency(item.priceSnapshot)} ({item.unitValue} {item.unit})
                      </p>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Customer & Delivery Coordinates
            </h3>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <strong className="text-gray-900">{order.userName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">WhatsApp Phone:</span>
                <strong className="text-gray-900 font-mono">+91 {order.userPhone}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Delivery Mode:</span>
                <span className="capitalize font-bold text-primary">
                  {order.deliveryType === 'delivery' ? 'Home Doorstep Delivery' : 'Store Pickup'}
                </span>
              </div>
              {order.addressSnapshot && (
                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-gray-400 block text-[10px] uppercase">Destination Address</span>
                  <p className="text-gray-800 font-medium mt-0.5">{order.addressSnapshot.fullAddress}</p>
                </div>
              )}
              {order.notes && (
                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-gray-400 block text-[10px] uppercase">Special Instructions</span>
                  <p className="text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg mt-0.5">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: WhatsApp Drafter & Price Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <WhatsAppPanel order={order} onMarkSent={loadData} />

          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-primary" />
              <span>Financials</span>
            </h3>

            <div className="space-y-2 text-xs text-gray-600 border-b border-gray-100 pb-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {order.deliveryCharge === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    <strong className="text-gray-900">{formatCurrency(order.deliveryCharge)}</strong>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Collected</span>
                <span className="text-lg font-extrabold text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <strong className="text-gray-800 uppercase">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <strong className="text-emerald-600 capitalize">{order.paymentStatus}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
