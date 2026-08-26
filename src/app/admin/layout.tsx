'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ShieldAlert, ArrowLeft, Lock, KeyRound, User } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loginAsAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-gray-400">
        Loading admin console...
      </div>
    );
  }

  // If user is not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-md text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Admin Access Required
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              This management portal is reserved for store owner <strong>Pratham Tarde</strong>.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 text-left space-y-1">
            <span className="font-bold text-gray-800 block">Current Logged-in User:</span>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>{user ? `${user.name} (${user.email})` : 'Not Signed In'}</span>
            </div>
            <span className="text-[10px] text-gray-400">Role: {user?.role || 'Guest'}</span>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Admin Account</span>
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row -mx-4 sm:-mx-6 lg:-mx-8 -my-6">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
