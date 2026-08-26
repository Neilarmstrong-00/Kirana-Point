import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import {
  Wheat,
  Milk,
  Apple,
  Droplet,
  Coffee,
  Flame,
  Sparkles,
  HeartHandshake,
  Package,
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  variant?: 'pill' | 'card';
}

const iconMap: Record<string, any> = {
  Wheat,
  Milk,
  Apple,
  Droplet,
  Coffee,
  Flame,
  Sparkles,
  HeartHandshake,
};

export function CategoryCard({ category, variant = 'card' }: CategoryCardProps) {
  const IconComponent = iconMap[category.iconName] || Package;

  if (variant === 'pill') {
    return (
      <Link
        href={`/category/${category.slug}`}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-primary hover:bg-primary-50/40 transition-all shrink-0 group"
      >
        <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
          <IconComponent className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors block">
            {category.name}
          </span>
          <span className="text-[10px] text-gray-400 block">{category.productCount || 0} items</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all text-center"
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-50/70 p-2 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
        {category.name}
      </h3>
      <span className="text-[11px] text-gray-400 mt-0.5">{category.productCount || 0} items</span>
    </Link>
  );
}
