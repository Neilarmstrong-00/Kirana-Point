'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Store,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live detection of admin vs customer role
  const isDetectedAdmin =
    identifier.trim().toLowerCase() === 'pratham@kiranapoint.com' ||
    identifier.trim().toLowerCase() === 'admin@kiranapoint.com' ||
    identifier.trim().toLowerCase() === '8208232735' ||
    identifier.trim().toLowerCase().includes('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setError('');
    setLoading(true);
    try {
      const user = await login(identifier.trim(), password);
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email/phone or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md shadow-primary/20">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome to Kirana Point
        </h1>
        <p className="text-xs text-gray-500">
          Sign in to manage your orders, saved addresses, and faster checkout.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-5">
        {/* Role Detection Banner */}
        {identifier.trim().length > 2 && (
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
                  <span className="font-bold block">Store Owner / Admin Portal</span>
                  <span className="text-[11px] text-amber-700">
                    Signing in will open the <strong>Store Management Console</strong>.
                  </span>
                </div>
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Customer Account</span>
                  <span className="text-[11px] text-emerald-700">
                    Signing in will open the <strong>Grocery Shopping Storefront</strong>.
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

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
                placeholder="Enter your registered email or phone"
                className="w-full text-xs p-3 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-700">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
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
                ? 'Signing in...'
                : isDetectedAdmin
                ? 'Sign In to Store Admin Console'
                : 'Sign In to Kirana Point'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Create customer account
        </Link>
      </p>
    </div>
  );
}
