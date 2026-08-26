'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategories, saveProduct } from '@/lib/firestore';
import { Category, Product, ProductUnit } from '@/types';
import { slugify, generateId } from '@/lib/utils';
import { ProductAutoFill } from '@/components/admin/ProductAutoFill';
import { AutoFillResult, generatePriceComparison } from '@/lib/product-autofill';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState(`KP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Pricing
  const [mrp, setMrp] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(85);

  // Unit & Stock
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [unitValue, setUnitValue] = useState<number>(1);
  const [stockQuantity, setStockQuantity] = useState<number>(30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);

  // Nutrition
  const [energy, setEnergy] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');

  // Tags
  const [tagsInput, setTagsInput] = useState('grocery, fresh');

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    });
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleAutoFill = (data: AutoFillResult) => {
    setName(data.name);
    setSlug(slugify(data.name));
    setBrand(data.brand);
    setDescription(data.description);
    if (data.ingredients) setIngredients(data.ingredients);
    if (data.barcode) setBarcode(data.barcode);
    if (data.imageUrl) setImageUrl(data.imageUrl);

    if (data.nutritionInfo) {
      if (data.nutritionInfo.energy) setEnergy(data.nutritionInfo.energy);
      if (data.nutritionInfo.protein) setProtein(data.nutritionInfo.protein);
      if (data.nutritionInfo.carbs) setCarbs(data.nutritionInfo.carbs);
      if (data.nutritionInfo.fat) setFat(data.nutritionInfo.fat);
      if (data.nutritionInfo.fiber) setFiber(data.nutritionInfo.fiber);
    }

    if (data.tags) {
      setTagsInput(data.tags.join(', '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      alert('Please provide product name and select a category.');
      return;
    }

    setLoading(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const discount = mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
      const priceComparison = generatePriceComparison(mrp, sellingPrice);

      const newProduct: Product = {
        id: `prod_${generateId('item')}`,
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        sku: sku.trim(),
        categoryId,
        categoryName: selectedCategory?.name || 'General',
        brand: brand.trim() || 'Fresh',
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
        isActive: true,
        images: [
          {
            url:
              imageUrl.trim() ||
              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
            altText: name.trim(),
            isPrimary: true,
            sortOrder: 1,
          },
        ],
        nutritionInfo: {
          energy: energy.trim() || undefined,
          protein: protein.trim() || undefined,
          carbs: carbs.trim() || undefined,
          fat: fat.trim() || undefined,
          fiber: fiber.trim() || undefined,
        },
        tags: tagsInput
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveProduct(newProduct);
      router.push('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
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
              Add New Product
            </h1>
            <p className="text-xs text-gray-500">
              Use automated Open Food Facts auto-fill to catalog items in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Fill Search Bar */}
      <ProductAutoFill onAutoFillComplete={handleAutoFill} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Product Info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Core Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Tata Salt Vacuum Evaporated 1kg"
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
                placeholder="e.g. Tata, Amul, Aashirvaad"
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-mono text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Barcode (EAN)</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g. 8901015000010"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-mono text-gray-700 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or raw GitHub asset URL"
                  className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                />
                <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of freshness, benefits, and storage instructions..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ingredients</label>
              <textarea
                rows={2}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List of ingredients..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Pricing & Stock Inventory
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unit Type</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none bg-white font-semibold text-gray-800"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="g">g (Gram)</option>
                <option value="L">L (Litre)</option>
                <option value="mL">mL (Millilitre)</option>
                <option value="pcs">pcs (Pieces)</option>
                <option value="pack">pack (Packet)</option>
                <option value="dozen">dozen (12 pcs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unit Value</label>
              <input
                type="number"
                value={unitValue}
                onChange={(e) => setUnitValue(parseFloat(e.target.value) || 1)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Stock Quantity *
              </label>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 5)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="salt, tata, iodized, staples"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            3. Nutrition Facts (Optional / Auto-filled)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] text-gray-600 mb-1">Energy</label>
              <input
                type="text"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                placeholder="e.g. 350 kcal"
                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1">Protein</label>
              <input
                type="text"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g. 8.5 g"
                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1">Carbs</label>
              <input
                type="text"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g. 70 g"
                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1">Total Fat</label>
              <input
                type="text"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="e.g. 3.2 g"
                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-600 mb-1">Dietary Fiber</label>
              <input
                type="text"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                placeholder="e.g. 4.1 g"
                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Publishing Product...' : 'Save & Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
