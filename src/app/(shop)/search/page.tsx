'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/firestore';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Search, Home, ChevronRight, PackageOpen } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setAllProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const searchResults = useMemo(() => {
    let list = [...allProducts];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (p.barcode && p.barcode.includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    return list;
  }, [allProducts, query, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">Search Store</span>
      </nav>

      {/* Search Header Input */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search atta, dal, milk, veggies, masala, snacks..."
            className="w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            {query ? `Search Results for "${query}"` : 'All Available Products'}
          </h2>
          <span className="text-xs font-semibold text-gray-500">
            {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">No items match your search</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try searching with another keyword or explore our full category list.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-gray-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
