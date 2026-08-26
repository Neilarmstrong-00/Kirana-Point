import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  title,
  subtitle,
  emptyMessage = 'No products found in this section.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-gray-100 p-8 my-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
          <PackageOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">{emptyMessage}</h3>
        <p className="text-xs text-gray-500 mt-1">Please check back later or try a different search filter.</p>
      </div>
    );
  }

  return (
    <div className="my-6">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-1">
          <div>
            {title && <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <span className="text-xs font-semibold text-gray-400">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
