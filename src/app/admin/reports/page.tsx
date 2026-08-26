'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, getProducts } from '@/lib/firestore';
import { Order, Product } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BarChart3,
  Download,
  TrendingUp,
  CreditCard,
  Truck,
  Store,
  ShoppingBag,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [ords, prods] = await Promise.all([getOrders(), getProducts()]);
      setOrders(ords);
      setProducts(prods);
      setLoading(false);
    }
    load();
  }, []);

  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const upiOrders = validOrders.filter((o) => o.paymentMethod === 'upi');
  const codOrders = validOrders.filter((o) => o.paymentMethod === 'cod');
  const deliveryOrders = validOrders.filter((o) => o.deliveryType === 'delivery');
  const pickupOrders = validOrders.filter((o) => o.deliveryType === 'pickup');

  // Top products calculation
  const productStats = new Map<string, { name: string; qty: number; revenue: number }>();
  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productStats.get(item.productId);
      if (existing) {
        existing.qty += item.quantity;
        existing.revenue += item.lineTotal;
      } else {
        productStats.set(item.productId, {
          name: item.productNameSnapshot,
          qty: item.quantity,
          revenue: item.lineTotal,
        });
      }
    });
  });

  const topProducts = Array.from(productStats.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Status',
      'Delivery Type',
      'Payment Method',
      'Payment Status',
      'Subtotal',
      'Delivery Charge',
      'Total Amount',
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      formatDate(o.placedAt || o.createdAt),
      `"${o.userName.replace(/"/g, '""')}"`,
      o.userPhone,
      o.status,
      o.deliveryType,
      o.paymentMethod,
      o.paymentStatus,
      o.subtotal,
      o.deliveryCharge,
      o.total,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Kirana_Point_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Sales Reports & Analytics
          </h1>
          <p className="text-xs text-gray-500">
            Financial summaries, payment splits, and best-selling grocery products.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark flex items-center gap-1.5 shadow-xs self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-gray-500">Total Valid Orders</span>
          <p className="text-2xl font-extrabold text-gray-900">{validOrders.length}</p>
          <span className="text-[10px] text-gray-400">Excluding cancelled orders</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-emerald-700">Gross Sales Revenue</span>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Free Gateway Fees</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-amber-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-amber-800">UPI Payments Split</span>
          <p className="text-2xl font-extrabold text-amber-800">
            {upiOrders.length}{' '}
            <span className="text-xs font-normal text-gray-500">
              ({validOrders.length > 0 ? Math.round((upiOrders.length / validOrders.length) * 100) : 0}%)
            </span>
          </p>
          <span className="text-[10px] text-gray-400">COD: {codOrders.length} orders</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-blue-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-blue-700">Delivery vs Pickup</span>
          <p className="text-2xl font-extrabold text-blue-700">
            {deliveryOrders.length}{' '}
            <span className="text-xs font-normal text-gray-500">
              ({validOrders.length > 0 ? Math.round((deliveryOrders.length / validOrders.length) * 100) : 0}% delivery)
            </span>
          </p>
          <span className="text-[10px] text-gray-400">Pickups: {pickupOrders.length}</span>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900">
          Top-Selling Grocery Products (By Revenue)
        </h3>

        {topProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">No product sales yet.</div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-3 bg-gray-50/70 rounded-2xl border border-gray-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-gray-900 block">{p.name}</span>
                    <span className="text-[11px] text-gray-500">{p.qty} units sold</span>
                  </div>
                </div>

                <span className="font-extrabold text-gray-900 text-sm">
                  {formatCurrency(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
