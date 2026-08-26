'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Store,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsAdmin, loginAsCustomer } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'all' | 'admin' | 'customer'>('all');

  // Live detection of admin vs customer role
  const isDetectedAdmin =
    identifier.trim().toLowerCase() === 'pratham@kiranapoint.com' ||
    identifier.trim().toLowerCase() === 'admin@kiranapoint.com' ||
    identifier.trim().toLowerCase() === '8208232735' ||
    identifier.trim().toLowerCase().includes('admin') ||
    identifier.trim().toLowerCase().includes('pratham') ||
    password === 'admin123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(identifier, password);
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickFill = () => {
    setIdentifier('pratham@kiranapoint.com');
    setPassword('admin123');
  };

  const handleCustomerQuickFill = () => {
    setIdentifier('rahul.sharma@example.com');
    setPassword('customer123');
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md shadow-primary/20">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Kirana Point Login
        </h1>
        <p className="text-xs text-gray-500">
          Sign in to access your account. System auto-detects Admin vs Customer roles.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-5">
        {/* Role Detection Banner */}
        <div
          className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 transition-all ${
            isDetectedAdmin
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {isDetectedAdmin ? (
            <>
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">👑 Store Owner / Admin Mode Detected</span>
                <span className="text-[11px] text-amber-700">
                  Logging in will redirect to <strong>Admin Dashboard & Store Controls</strong>.
                </span>
              </div>
            </>
          ) : (
            <>
              <User className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">👤 Customer Mode</span>
                <span className="text-[11px] text-emerald-700">
                  Logging in will open the <strong>Grocery Shopping Storefront</strong>.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. pratham@kiranapoint.com or 8208232735"
                className="w-full text-xs p-3 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-700">Password</label>
              <span className="text-[10px] text-gray-400">Admin default: admin123</span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Authenticating...'
                : isDetectedAdmin
                ? 'Sign In to Admin Dashboard'
                : 'Sign In to Kirana Point'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400 bg-white px-2">
            Quick Auto-Fill Credentials
          </div>
        </div>

        {/* 1-Click Fillers */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleAdminQuickFill}
            className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-100/50 text-left transition-colors group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-0.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Owner / Admin</span>
            </div>
            <p className="text-[10px] text-amber-700 font-mono">pratham@kiranapoint.com</p>
          </button>

          <button
            type="button"
            onClick={handleCustomerQuickFill}
            className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-100/50 text-left transition-colors group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-0.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer User</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-mono">rahul.sharma@example.com</p>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">
        New customer?{' '}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Create customer account
        </Link>
      </p>
    </div>
  );
}
