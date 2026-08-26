'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, deleteProduct, saveProduct } from '@/lib/firestore';
import { Product, Category } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { StockBadge } from '@/components/product/StockBadge';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the product catalog?`)) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleToggleActive = async (product: Product) => {
    await saveProduct({ ...product, isActive: !product.isActive });
    loadData();
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.includes(q)) ||
      p.sku.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'all' || p.categoryId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Product Catalog
          </h1>
          <p className="text-xs text-gray-500">
            Manage your store's inventory, prices, Open Food Facts data, and descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product (Auto-Fill)</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, brand, SKU, or barcode..."
            className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none bg-white font-semibold text-gray-700"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No products match your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]?.url || '/images/placeholder.svg'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="font-bold text-gray-900 hover:text-primary block truncate max-w-[200px]"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-gray-500">
                            {p.brand} • {p.unitValue} {p.unit}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-700">
                      {p.categoryName}
                    </td>

                    <td className="p-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-gray-900 text-sm">
                          {formatCurrency(p.sellingPrice)}
                        </span>
                        {p.mrp > p.sellingPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatCurrency(p.mrp)}
                          </span>
                        )}
                      </div>
                      {p.discount > 0 && (
                        <span className="text-[10px] text-accent font-bold">
                          {p.discount}% OFF
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <StockBadge
                          stockQuantity={p.stockQuantity}
                          lowStockThreshold={p.lowStockThreshold}
                        />
                        <span className="text-[10px] text-gray-500 block">
                          {p.stockQuantity} {p.unit} in stock
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-gray-700 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
