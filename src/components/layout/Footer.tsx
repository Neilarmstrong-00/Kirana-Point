'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';
import { generateCustomerSupportLink } from '@/lib/whatsapp';

export function Footer() {
  const whatsappUrl = generateCustomerSupportLink(DEFAULT_STORE_CONFIG.storePhone);

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 pt-12 pb-24 md:pb-12 mt-16">
      {/* Feature Highlights Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Same-Day Delivery</p>
              <p className="text-[11px] text-gray-500">Fast doorstep service in 30-45 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-dark flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">100% Genuine Quality</p>
              <p className="text-[11px] text-gray-500">Fresh stock from trusted local sources</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Zero Gateway Fees</p>
              <p className="text-[11px] text-gray-500">Pay via Direct UPI or Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">WhatsApp Updates</p>
              <p className="text-[11px] text-gray-500">Live order status straight to your chat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Store Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-gray-900">Kirana Point</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your neighbourhood grocery store, bringing fresh daily essentials, staples, dairy and snacks directly to your doorstep.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-[#25D366] text-white px-3.5 py-2 rounded-xl hover:bg-[#1EBE5D] transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Store on WhatsApp</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/category/staples-grains" className="hover:text-primary transition-colors">
                  Atta, Rice & Dals
                </Link>
              </li>
              <li>
                <Link href="/category/dairy-eggs" className="hover:text-primary transition-colors">
                  Dairy & Eggs
                </Link>
              </li>
              <li>
                <Link href="/category/fruits-vegetables" className="hover:text-primary transition-colors">
                  Fresh Fruits & Veggies
                </Link>
              </li>
              <li>
                <Link href="/category/oils-ghee" className="hover:text-primary transition-colors">
                  Oils & Pure Ghee
                </Link>
              </li>
              <li>
                <Link href="/category/snacks-beverages" className="hover:text-primary transition-colors">
                  Snacks & Beverages
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">
                  View Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary transition-colors">
                  My Profile & Saved Addresses
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary font-medium text-primary transition-colors">
                  🛡️ Store Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Timings */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Store Timings & Address
            </h4>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{DEFAULT_STORE_CONFIG.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>Open Everyday: {DEFAULT_STORE_CONFIG.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 {DEFAULT_STORE_CONFIG.storePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{DEFAULT_STORE_CONFIG.storeEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
        <p>© {new Date().getFullYear()} Kirana Point. 100% Free & Open-source E-Commerce.</p>
        <p>Direct UPI Payments • WhatsApp Order Alerts • Free Delivery &gt; ₹2,000</p>
      </div>
    </footer>
  );
}
