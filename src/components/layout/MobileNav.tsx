'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useMounted } from '@/hooks/useMounted';

export function MobileNav() {
  const pathname = usePathname();
  const mounted = useMounted();
  const cartItemCount = useCartStore((state) => state.getItemCount());

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const effectiveCartCount = mounted ? cartItemCount : 0;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: LayoutGrid },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: effectiveCartCount > 0 ? effectiveCartCount : undefined,
    },
    { label: 'Orders', href: '/orders', icon: ClipboardList },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                isActive ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
