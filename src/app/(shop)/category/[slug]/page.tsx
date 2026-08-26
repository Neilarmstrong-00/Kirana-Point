'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/firestore';
import { Category, Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronRight, Home, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'discount'>('featured');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [categories, products] = await Promise.all([getCategories(), getProducts()]);
      const cat = categories.find((c) => c.slug === slug || c.id === slug);
      setCategory(cat || null);
      setAllProducts(products);
      setLoading(false);
    }
    loadData();
  }, [slug]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return allProducts.filter((p) => p.categoryId === category.id || p.categoryName === category.name);
  }, [allProducts, category]);

  const availableBrands = useMemo(() => {
    return Array.from(new Set(categoryProducts.map((p) => p.brand))).filter(Boolean);
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...categoryProducts];

    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stockQuantity > 0);
    }

    if (sortBy === 'price_low') {
      list.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discount - a.discount);
    }

    return list;
  }, [categoryProducts, selectedBrand, inStockOnly, sortBy]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        Loading category products...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Category Not Found</h2>
        <p className="text-xs text-gray-500">The requested category does not exist.</p>
        <Link href="/categories" className="inline-block text-xs font-bold text-primary hover:underline">
          ← Back to All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/categories" className="hover:text-primary">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary-50 to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-primary-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-100 px-2.5 py-0.5 rounded-full">
            Grocery Section
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {category.name}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Browse {categoryProducts.length} items with fresh daily stock guarantees and fast delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs">
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Listed
          </span>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Filter:</span>
          </div>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary"
          >
            <option value="all">All Brands ({availableBrands.length})</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-primary rounded"
            />
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <span>Sort By:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="discount">Highest Discount %</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <h3 className="text-sm font-bold text-gray-900">No products match your filters</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting the brand filter or in-stock toggle.</p>
          <button
            onClick={() => {
              setSelectedBrand('all');
              setInStockOnly(false);
            }}
            className="mt-3 text-xs font-bold text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
