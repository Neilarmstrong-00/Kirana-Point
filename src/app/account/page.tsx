'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Home,
  Sparkles,
} from 'lucide-react';

export default function AccountPage() {
  const { user, addresses, logout, updateProfile, loginAsAdmin, loginAsCustomer } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim(), phone: phone.trim() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">My Account</span>
      </nav>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-primary">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                {user?.name || 'Customer Profile'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 uppercase">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs hover:bg-primary-dark transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/orders"
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-primary hover:bg-primary-50/20 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-primary">
                Order History & Invoices
              </h3>
              <p className="text-[11px] text-gray-500">Track and view all past orders</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
        </Link>

        <Link
          href="/account/addresses"
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-primary hover:bg-primary-50/20 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-primary">
                Saved Delivery Addresses
              </h3>
              <p className="text-[11px] text-gray-500">{addresses.length} saved addresses with map pins</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
        </Link>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
      >
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              WhatsApp Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit phone"
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address (Login Identity)
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600">
              Profile updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>

      {/* Switch Demo Profile helper */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 space-y-2">
        <span className="font-bold text-gray-900 block">Switch Demo Identity:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loginAsAdmin}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:border-primary font-semibold text-xs"
          >
            🛡️ Store Admin Identity
          </button>
          <button
            type="button"
            onClick={loginAsCustomer}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:border-primary font-semibold text-xs"
          >
            👤 Customer (Rahul Sharma)
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-xs ml-auto"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
