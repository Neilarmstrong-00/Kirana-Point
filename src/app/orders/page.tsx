'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/firestore';
import { useAuthStore } from '@/stores/authStore';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ClipboardList,
  Home,
  ChevronRight,
  Truck,
  Store,
  ArrowRight,
  PackageOpen,
} from 'lucide-react';

export default function OrderHistoryPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allOrders = await getOrders();
      setOrders(allOrders);
      setLoading(false);
    }
    load();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return (
        order.status === 'pending' ||
        order.status === 'awaiting_payment' ||
        order.status === 'payment_verifying' ||
        order.status === 'confirmed' ||
        order.status === 'preparing' ||
        order.status === 'out_for_delivery' ||
        order.status === 'ready_for_pickup'
      );
    }
    if (filter === 'completed') {
      return order.status === 'delivered' || order.status === 'picked_up';
    }
    if (filter === 'cancelled') {
      return order.status === 'cancelled';
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; text: string }> = {
      pending: { label: 'Order Placed', bg: 'bg-blue-50', text: 'text-blue-700' },
      awaiting_payment: { label: 'Payment Due', bg: 'bg-amber-50', text: 'text-amber-800' },
      payment_verifying: { label: 'Verifying Payment', bg: 'bg-amber-100', text: 'text-amber-900' },
      confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700' },
      preparing: { label: 'Packing & Preparing', bg: 'bg-purple-50', text: 'text-purple-700' },
      out_for_delivery: { label: 'Out for Delivery', bg: 'bg-primary-50', text: 'text-primary' },
      ready_for_pickup: { label: 'Ready for Pickup', bg: 'bg-primary-50', text: 'text-primary' },
      delivered: { label: 'Delivered', bg: 'bg-emerald-100', text: 'text-emerald-800' },
      picked_up: { label: 'Picked Up', bg: 'bg-emerald-100', text: 'text-emerald-800' },
      cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700' },
    };

    const item = map[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700' };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${item.bg} ${item.text}`}
      >
        {item.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">Order History</span>
      </nav>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Your Grocery Orders
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View all recent orders, tracking statuses, and payment receipts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-xs overflow-x-auto">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-colors shrink-0 ${
              filter === tab
                ? 'bg-primary text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? 'All Orders' : tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500">Loading order history...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">No orders found</h3>
          <p className="text-xs text-gray-500 mt-1">You do not have any orders in this tab.</p>
          <Link href="/" className="inline-block mt-3 text-xs font-bold text-primary hover:underline">
            Start Shopping Now →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center font-bold text-xs">
                    {order.deliveryType === 'delivery' ? (
                      <Truck className="w-4 h-4" />
                    ) : (
                      <Store className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      {formatDate(order.placedAt || order.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-gray-600">
                  <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}: </span>
                  <span className="text-gray-900 font-medium">
                    {order.items.map((i) => i.productNameSnapshot).slice(0, 3).join(', ')}
                    {order.items.length > 3 ? ` +${order.items.length - 3} more` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm sm:text-base font-extrabold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 bg-primary-50 hover:bg-primary-100 text-primary text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
