'use client';

import React, { useState } from 'react';
import { Sparkles, Search, Loader2, CheckCircle2 } from 'lucide-react';
import { autoFillProduct, AutoFillResult } from '@/lib/product-autofill';

interface ProductAutoFillProps {
  onAutoFillComplete: (data: AutoFillResult) => void;
}

export function ProductAutoFill({ onAutoFillComplete }: ProductAutoFillProps) {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<AutoFillResult | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !barcode.trim()) return;

    setLoading(true);
    try {
      const result = await autoFillProduct({
        brand: brand.trim(),
        name: name.trim(),
        weight: weight.trim(),
        barcode: barcode.trim() || undefined,
      });
      setPreviewData(result);
    } catch (err) {
      console.error('Auto-fill error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (previewData) {
      onAutoFillComplete(previewData);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-50/70 to-emerald-50/50 rounded-2xl border border-primary-100 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900">
            Automated Product Cataloging & Auto-Fill
          </h3>
          <p className="text-[11px] text-gray-500">
            Powered by Open Food Facts. Enter name/brand to auto-fetch description, ingredients, nutrition & tags.
          </p>
        </div>
      </div>

      <form onSubmit={handleFetch} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand (e.g. Tata, Amul)"
            className="w-full text-xs p-2.5 bg-white rounded-xl border border-gray-200 focus:border-primary outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name (e.g. Salt, Butter, Toor Dal) *"
            className="w-full text-xs p-2.5 bg-white rounded-xl border border-gray-200 focus:border-primary outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (e.g. 1kg, 500g)"
            className="w-full text-xs p-2.5 bg-white rounded-xl border border-gray-200 focus:border-primary outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Or Barcode (optional, e.g. 8901015000010)"
            className="w-full text-xs p-2.5 bg-white rounded-xl border border-gray-200 focus:border-primary outline-none"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 shadow-xs"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>{loading ? 'Searching...' : 'Auto-Fill Data'}</span>
          </button>
        </div>
      </form>

      {/* Preview Card */}
      {previewData && (
        <div className="bg-white rounded-xl p-4 border border-primary-200 shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-900">
              Fetched Product: <strong className="text-primary">{previewData.name}</strong>
            </span>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply to Form</span>
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">{previewData.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {previewData.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
