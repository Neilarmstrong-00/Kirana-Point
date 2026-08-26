'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, updateOrderStatus, subscribeToDocument } from '@/lib/firestore';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusPipeline } from '@/components/admin/OrderStatusPipeline';
import {
  Truck,
  Store,
  MapPin,
  Clock,
  Home,
  ChevronRight,
  MessageSquare,
  XCircle,
  Receipt,
} from 'lucide-react';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';
import { generateCustomerSupportLink } from '@/lib/whatsapp';

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(orderId).then((ord) => {
      setOrder(ord);
      setLoading(false);
    });

    const unsubscribe = subscribeToDocument<Order>('kp_orders_v1', orderId, (updated) => {
      if (updated) setOrder(updated);
    });

    return () => unsubscribe();
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
        <Link href="/orders" className="text-xs font-bold text-primary hover:underline">
          ← View All Orders
        </Link>
      </div>
    );
  }

  const supportLink = generateCustomerSupportLink(DEFAULT_STORE_CONFIG.storePhone, order.orderNumber);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      await updateOrderStatus(order.id, 'cancelled', order.userName, 'Cancelled by customer');
    }
  };

  const canCancel = order.status === 'pending' || order.status === 'awaiting_payment' || order.status === 'confirmed';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/orders" className="hover:text-primary">
          Orders
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {formatDate(order.placedAt || order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Live Status Pipeline */}
      <OrderStatusPipeline
        currentStatus={order.status}
        deliveryType={order.deliveryType}
        onStatusChange={() => {}}
        isReadOnly={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Items & Delivery Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Ordered Items ({order.items.length})
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
                      <p className="text-[11px] text-gray-500 mt-0.5">
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

          {/* Delivery & Fulfilment Details */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Fulfilment & Dispatch
            </h3>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                {order.deliveryType === 'delivery' ? <Truck className="w-4 h-4" /> : <Store className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-gray-900 block">
                  {order.deliveryType === 'delivery' ? 'Home Doorstep Delivery' : 'Store Counter Pickup'}
                </span>
                <p className="text-gray-600 text-[11px] mt-0.5">
                  {order.deliveryType === 'delivery'
                    ? order.addressSnapshot?.fullAddress || 'Customer Address'
                    : DEFAULT_STORE_CONFIG.storeAddress}
                </p>
                {order.deliveryDetail && order.deliveryDetail.distanceKm > 0 && (
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Distance: {order.deliveryDetail.distanceKm} km from store
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Price Breakdown & Cancel CTA */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-primary" />
              <span>Bill Details</span>
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
                <span className="text-sm font-bold text-gray-900">Total Paid</span>
                <span className="text-lg font-extrabold text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <strong className="text-gray-800 uppercase">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <strong className="text-emerald-600 capitalize">{order.paymentStatus}</strong>
              </div>
              {order.upiTransactionRef && (
                <div className="flex justify-between">
                  <span>UPI Ref ID:</span>
                  <span className="font-mono text-gray-800">{order.upiTransactionRef}</span>
                </div>
              )}
            </div>

            {/* Cancel Button if eligible */}
            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel This Order</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
