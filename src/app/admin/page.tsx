'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders, getPayments, getProducts, verifyPayment, rejectPayment } from '@/lib/firestore';
import { Order, Payment, Product } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { StockAlertList } from '@/components/admin/StockAlertList';
import {
  CreditCard,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [ords, pays, prods] = await Promise.all([getOrders(), getPayments(), getProducts()]);
    setOrders(ords);
    setPayments(pays);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingPayments = payments.filter(
    (p) => p.status === 'user_claimed_paid' || p.status === 'pending'
  );

  const todayRevenue = orders
    .filter((o) => o.status !== 'cancelled' && (o.paymentStatus === 'verified' || o.paymentMethod === 'cod'))
    .reduce((sum, o) => sum + o.total, 0);

  const handleVerify = async (payment: Payment) => {
    const ref = prompt(`Enter UPI Reference ID for ${payment.userName} (optional):`, '');
    await verifyPayment(payment.orderId, 'admin', ref || undefined);
    loadData();
  };

  const handleReject = async (payment: Payment) => {
    const reason = prompt('Enter reason for rejecting this payment claim:', 'Payment not received in UPI app');
    if (reason) {
      await rejectPayment(payment.orderId, 'admin', reason);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-100 px-2.5 py-0.5 rounded-full">
            Live Store Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Store Dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Overview of orders, revenue, inventory alerts, and UPI payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics Stats Cards */}
      <DashboardStats
        todayOrdersCount={orders.length}
        todayRevenue={todayRevenue}
        pendingPaymentsCount={pendingPayments.length}
        lowStockCount={products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length}
      />

      {/* Priority Section: Pending UPI Verifications Queue */}
      {pendingPayments.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-3xl border-2 border-amber-500/40 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Pending UPI Verifications ({pendingPayments.length})
                </h3>
                <p className="text-[11px] text-gray-600">
                  Customers claimed they completed payment. Match amount in your UPI app.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full animate-pulse">
              Priority Queue
            </span>
          </div>

          <div className="divide-y divide-amber-200/50 bg-white/90 rounded-2xl border border-amber-200/60 overflow-hidden">
            {pendingPayments.map((pay) => (
              <div
                key={pay.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      Order #{pay.orderNumber}
                    </span>
                    <span className="text-xs font-extrabold text-primary">
                      {formatCurrency(pay.amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Customer: <strong>{pay.userName}</strong> • Phone: +91 {pay.userPhone}
                  </p>
                  <span className="text-[10px] text-gray-400">
                    Claimed: {formatDate(pay.userClaimedAt || pay.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleVerify(pay)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Confirm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(pay)}
                    className="flex items-center gap-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <Link
                    href={`/admin/orders/${pay.orderId}`}
                    className="p-2 text-gray-400 hover:text-gray-700"
                    title="View Full Order"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Recent Customer Orders</h3>
              <p className="text-[11px] text-gray-500">Live order stream</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">No orders registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px]">
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 6).map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 font-bold text-gray-900">
                        <Link href={`/admin/orders/${ord.id}`} className="hover:text-primary">
                          #{ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 text-gray-700">
                        <span className="font-semibold block">{ord.userName}</span>
                        <span className="text-[10px] text-gray-400">{ord.items.length} items</span>
                      </td>
                      <td className="py-3 font-extrabold text-gray-900">
                        {formatCurrency(ord.total)}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Stock Alerts & Revenue */}
        <div className="lg:col-span-1 space-y-6">
          <StockAlertList products={products} onRestocked={loadData} />
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}
