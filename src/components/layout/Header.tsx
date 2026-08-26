'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  MapPin,
  User as UserIcon,
  Store,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { getProducts } from '@/lib/firestore';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useMounted } from '@/hooks/useMounted';

export function Header() {
  const router = useRouter();
  const mounted = useMounted();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartSubtotal = useCartStore((state) => state.getSubtotal());
  const { user, loginAsAdmin, loginAsCustomer, logout, openAuthModal } = useAuthStore();

  const effectiveCartCount = mounted ? cartItemCount : 0;
  const effectiveSubtotal = mounted ? cartSubtotal : 0;
  const effectiveUser = mounted ? user : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 5);
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top Banner for Free Delivery */}
      <div className="bg-primary-50 text-primary-800 text-xs py-1.5 px-4 text-center font-medium border-b border-primary-100 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Free doorstep delivery on orders above <strong>₹2,000</strong>! Fast neighbourhood service.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo & Store Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                    Kirana Point
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-accent-100 text-accent-dark px-1.5 py-0.5 rounded-full">
                    Fresh
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 hidden sm:block">
                  Your neighbourhood store, now online
                </p>
              </div>
            </Link>

            {/* Location Pill */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-gray-800">Delivering in:</span>
              <span className="truncate max-w-[170px]">Khamgaon, Buldhana (15km)</span>
            </div>
          </div>

          {/* Search Bar with Autocomplete Dropdown */}
          <div className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setIsSearchOpen(true)}
                placeholder="Search atta, dal, milk, fresh veggies, snacks..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm bg-gray-50/90 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-gray-50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Products ({searchResults.length})
                </div>
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3 hover:bg-primary-50/50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]?.url || '/images/placeholder.svg'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.unitValue} {product.unit} • {product.brand}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                      {product.discount > 0 && (
                        <span className="block text-[10px] text-accent font-semibold">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Admin Access */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl transition-colors border border-primary-200/60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>

            {/* User Profile / Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xs overflow-hidden">
                  {effectiveUser?.avatarUrl ? (
                    <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:inline max-w-[100px] truncate">
                  {effectiveUser ? effectiveUser.name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in">
                  {effectiveUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{effectiveUser.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{effectiveUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                          {effectiveUser.role}
                        </span>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        My Profile & Addresses
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Order History & Tracking
                      </Link>
                      {effectiveUser.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-primary font-bold hover:bg-primary-50"
                        >
                          ⚡ Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1 pt-1">
                        <div className="px-4 py-1.5 text-[11px] text-gray-400 font-medium">
                          Quick Switch Demo User:
                        </div>
                        <button
                          onClick={() => {
                            loginAsAdmin();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          Switch to 🛡️ Store Admin
                        </button>
                        <button
                          onClick={() => {
                            loginAsCustomer();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          Switch to 👤 Customer (Rahul)
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium border-t border-gray-100 mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openAuthModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-primary hover:bg-primary-50 transition-colors"
                      >
                        Sign In / Register Portal
                      </button>
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Full Login Page
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Create Free Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button with Count Badge */}
            <Link
              href="/cart"
              className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {effectiveCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                    {effectiveCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-primary-200 tracking-wider">
                  Cart
                </span>
                <span className="text-xs font-bold leading-tight">
                  {effectiveCartCount > 0 ? formatCurrency(effectiveSubtotal) : '₹0'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
