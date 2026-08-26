'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders, updateOrderStatus } from '@/lib/firestore';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShoppingBag,
  Search,
  Truck,
  Store,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const ords = await getOrders();
    setOrders(ords);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.userName.toLowerCase().includes(q) ||
      order.userPhone.includes(q);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending_payment' &&
        (order.status === 'payment_verifying' || order.status === 'awaiting_payment')) ||
      (statusFilter === 'active' &&
        (order.status === 'confirmed' ||
          order.status === 'preparing' ||
          order.status === 'out_for_delivery' ||
          order.status === 'ready_for_pickup')) ||
      order.status === statusFilter;

    const matchesPayment =
      paymentFilter === 'all' || order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Order Management
          </h1>
          <p className="text-xs text-gray-500">
            Track, verify, pack, and dispatch customer grocery orders.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="sm:col-span-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order#, name, phone..."
              className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none bg-white font-semibold text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="pending_payment">⚡ Payment Pending Verification</option>
              <option value="confirmed">Confirmed (To Pack)</option>
              <option value="preparing">Packing & Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="ready_for_pickup">Ready for Pickup</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none bg-white font-semibold text-gray-700"
            >
              <option value="all">All Payment Methods</option>
              <option value="upi">UPI Payments</option>
              <option value="cod">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No orders match the filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Fulfilment</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-extrabold text-gray-900 hover:text-primary block text-sm"
                      >
                        #{order.orderNumber}
                      </Link>
                      <span className="text-[11px] text-gray-400">
                        {formatDate(order.placedAt || order.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-900 block">{order.userName}</span>
                      <span className="text-[11px] text-gray-500 font-mono">+91 {order.userPhone}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {order.deliveryType === 'delivery' ? (
                          <Truck className="w-4 h-4 text-primary" />
                        ) : (
                          <Store className="w-4 h-4 text-primary" />
                        )}
                        <span className="capitalize font-medium text-gray-700">
                          {order.deliveryType}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-bold text-gray-800 uppercase block">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-bold capitalize ${
                          order.paymentStatus === 'verified'
                            ? 'text-emerald-600'
                            : order.paymentStatus === 'awaiting_verification'
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {order.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-4 font-extrabold text-gray-900 text-sm">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary-50 text-primary">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white hover:bg-primary-dark font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
