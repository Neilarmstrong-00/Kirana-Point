'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  AlertTriangle,
  Users,
  Settings,
  BarChart3,
  Store,
  CreditCard,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { getOrders, getPayments, getProducts } from '@/lib/firestore';

export function AdminSidebar() {
  const pathname = usePathname();
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await getOrders();
      const payments = await getPayments();
      const products = await getProducts();

      setPendingPaymentsCount(
        payments.filter((p) => p.status === 'user_claimed_paid' || p.status === 'pending').length
      );
      setPendingOrdersCount(
        orders.filter(
          (o) => o.status === 'pending' || o.status === 'payment_verifying' || o.status === 'awaiting_payment'
        ).length
      );
      setLowStockCount(products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length);
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500',
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      label: 'Stock & Alerts',
      href: '/admin/stock',
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-red-500',
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      label: 'Store Settings',
      href: '/admin/settings',
      icon: Settings,
    },
    {
      label: 'Sales Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden p-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
            KP
          </div>
          <span className="font-bold text-sm text-gray-900">Admin Control</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Overlay on mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-xl`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                Kirana Point
              </span>
              <p className="text-[10px] text-primary-200 uppercase font-semibold">
                Admin Portal
              </p>
            </div>
          </Link>
          <Link
            href="/"
            title="Back to Customer Store"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Priority Payment Alert Strip if any pending payments */}
        {pendingPaymentsCount > 0 && (
          <Link
            href="/admin"
            className="mx-3 mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-semibold">{pendingPaymentsCount} UPI Verification{pendingPaymentsCount > 1 ? 's' : ''}</span>
            </div>
            <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Action
            </span>
          </Link>
        )}

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`${
                      item.badgeColor || 'bg-primary'
                    } text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Customer Store Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            <Store className="w-4 h-4 text-primary-200" />
            <span>Go to Customer Store</span>
          </Link>
          <p className="text-[10px] text-slate-500 text-center mt-2.5">
            Kirana Point Store Management Portal
          </p>
        </div>
      </aside>
    </>
  );
}
