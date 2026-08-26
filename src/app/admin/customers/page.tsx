'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/firestore';
import { Order, User } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Users, Search, Phone, Mail, ShoppingBag, ExternalLink } from 'lucide-react';

interface CustomerSummary {
  uid: string;
  name: string;
  phone: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const orders = await getOrders();

      const customerMap = new Map<string, CustomerSummary>();

      orders.forEach((o) => {
        const key = o.userPhone || o.userEmail || o.userId;
        const existing = customerMap.get(key);

        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += o.total;
          if (new Date(o.placedAt || o.createdAt) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = o.placedAt || o.createdAt;
          }
        } else {
          customerMap.set(key, {
            uid: o.userId,
            name: o.userName,
            phone: o.userPhone,
            email: o.userEmail,
            orderCount: 1,
            totalSpent: o.total,
            lastOrderDate: o.placedAt || o.createdAt,
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Customer Directory
        </h1>
        <p className="text-xs text-gray-500">
          Directory of registered shoppers, lifetime spend, and purchase histories.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, or email..."
            className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone & WhatsApp</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.phone || c.uid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-gray-900 block text-sm">{c.name}</span>
                    </td>
                    <td className="p-4 font-mono text-gray-700">
                      +91 {c.phone}
                    </td>
                    <td className="p-4 text-gray-500">{c.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary">
                        {c.orderCount} Order{c.orderCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-gray-900 text-sm">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="p-4 text-right text-gray-500 text-[11px]">
                      {formatDate(c.lastOrderDate)}
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
