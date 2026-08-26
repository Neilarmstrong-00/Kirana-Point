'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { Home, ChevronRight, MapPin, ArrowLeft } from 'lucide-react';

export default function AddressesPage() {
  const { selectedAddressId, setDefaultAddress } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/account" className="hover:text-primary">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">Delivery Addresses</span>
      </nav>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Saved Delivery Addresses
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your home, work, and other delivery destinations with precision map pins.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
        <AddressSelector
          selectedAddressId={selectedAddressId}
          onSelectAddress={(addr) => setDefaultAddress(addr.id)}
        />
      </div>

      <div>
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </Link>
      </div>
    </div>
  );
}
