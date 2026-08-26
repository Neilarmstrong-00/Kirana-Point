'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getCategories, saveProduct } from '@/lib/firestore';
import { Category, Product, ProductUnit } from '@/types';
import { slugify } from '@/lib/utils';
import { generatePriceComparison } from '@/lib/product-autofill';
import { ArrowLeft, Save, Trash2, Image as ImageIcon } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mrp, setMrp] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(85);
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [unitValue, setUnitValue] = useState<number>(1);
  const [stockQuantity, setStockQuantity] = useState<number>(30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [isActive, setIsActive] = useState(true);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prod, cats] = await Promise.all([getProductById(productId), getCategories()]);
      setProduct(prod);
      setCategories(cats);

      if (prod) {
        setName(prod.name);
        setSlug(prod.slug);
        setSku(prod.sku);
        setCategoryId(prod.categoryId);
        setBrand(prod.brand);
        setDescription(prod.description);
        setIngredients(prod.ingredients || '');
        setBarcode(prod.barcode || '');
        setImageUrl(prod.images[0]?.url || '');
        setMrp(prod.mrp);
        setSellingPrice(prod.sellingPrice);
        setUnit(prod.unit);
        setUnitValue(prod.unitValue);
        setStockQuantity(prod.stockQuantity);
        setLowStockThreshold(prod.lowStockThreshold);
        setIsActive(prod.isActive);
        setTagsInput(prod.tags.join(', '));
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const discount = mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
      const priceComparison = generatePriceComparison(mrp, sellingPrice);

      const updated: Product = {
        ...product,
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        sku: sku.trim(),
        categoryId,
        categoryName: selectedCategory?.name || product.categoryName,
        brand: brand.trim(),
        description: description.trim(),
        ingredients: ingredients.trim() || undefined,
        barcode: barcode.trim() || undefined,
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        discount: Math.max(0, discount),
        priceComparison,
        unit,
        unitValue: Number(unitValue),
        stockQuantity: Number(stockQuantity),
        lowStockThreshold: Number(lowStockThreshold),
        isActive,
        images: [
          {
            url: imageUrl.trim() || product.images[0]?.url || '/images/placeholder.svg',
            altText: name.trim(),
            isPrimary: true,
            sortOrder: 1,
          },
        ],
        tags: tagsInput
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        updatedAt: new Date().toISOString(),
      };

      await saveProduct(updated);
      router.push('/admin/products');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-500">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Product Not Found</h2>
        <Link href="/admin/products" className="text-xs font-bold text-primary hover:underline">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Edit Product: {product.name}
            </h1>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Core Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Brand *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none bg-white font-semibold text-gray-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Pricing & Inventory
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">MRP (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={mrp}
                onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-extrabold text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Active Status</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full text-xs py-2.5 rounded-xl font-bold uppercase transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isActive ? 'Active in Store' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Product...' : 'Save Product Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
