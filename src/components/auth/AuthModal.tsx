'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  Store,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMessage,
    closeAuthModal,
    login,
    register,
    loginAsCustomer,
    loginAsAdmin,
  } = useAuthStore();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isDetectedAdmin =
    identifier.trim().toLowerCase() === 'pratham@kiranapoint.com' ||
    identifier.trim().toLowerCase() === 'admin@kiranapoint.com' ||
    identifier.trim().toLowerCase() === '8208232735' ||
    identifier.trim().toLowerCase().includes('admin') ||
    identifier.trim().toLowerCase().includes('pratham') ||
    password === 'admin123';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    try {
      await login(identifier, password);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-7 relative space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md shadow-primary/20">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            {tab === 'login' ? 'Sign In to Kirana Point' : 'Create Free Customer Account'}
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {authModalMessage || 'Please sign in or register to complete your order.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            New Customer? Register
          </button>
        </div>

        {tab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
            {isDetectedAdmin && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>👑 Store Owner Mode (Pratham Tarde) Detected</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. rahul@example.com or 8208232735"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                <span className="text-[10px] text-gray-400">Owner default: admin123</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In & Continue Shopping'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400 bg-white px-2">
                Or 1-Click Fast Login
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loginAsCustomer}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-100/50 text-left transition-colors"
              >
                <span className="text-xs font-bold text-emerald-900 block">👤 Customer Demo</span>
                <span className="text-[10px] text-emerald-700">Rahul Sharma</span>
              </button>

              <button
                type="button"
                onClick={loginAsAdmin}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-100/50 text-left transition-colors"
              >
                <span className="text-xs font-bold text-amber-900 block">👑 Store Owner</span>
                <span className="text-[10px] text-amber-700">Pratham Tarde</span>
              </button>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                />
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none font-mono"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Set Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50 mt-1"
            >
              <span>{loading ? 'Creating Account...' : 'Register & Start Shopping'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
