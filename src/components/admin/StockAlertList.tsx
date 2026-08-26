'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { AlertTriangle, Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { restockProduct } from '@/lib/firestore';

interface StockAlertListProps {
  products: Product[];
  onRestocked?: () => void;
}

export function StockAlertList({ products, onRestocked }: StockAlertListProps) {
  const lowStockItems = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleRestock = async (productId: string) => {
    await restockProduct(productId, restockQty, 'Store Manager', 'Quick Alert Restock');
    setRestockingId(null);
    setSuccessId(productId);
    setTimeout(() => setSuccessId(null), 2500);
    if (onRestocked) onRestocked();
  };

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <Check className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-bold text-gray-900">Inventory Healthy</h4>
        <p className="text-[11px] text-gray-500 mt-0.5">All products are currently well-stocked.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Critical Low Stock Alerts</h4>
            <p className="text-[10px] text-gray-500">{lowStockItems.length} items need replenishment</p>
          </div>
        </div>
        <Link
          href="/admin/stock"
          className="text-xs font-bold text-primary hover:underline"
        >
          View Stock Desk
        </Link>
      </div>

      <div className="space-y-2">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-red-50/40 rounded-xl border border-red-100 text-xs"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.images[0]?.url || '/images/placeholder.svg'}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-200"
              />
              <div>
                <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-[11px] text-gray-500">
                  {item.unitValue} {item.unit} • {formatCurrency(item.sellingPrice)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="font-extrabold text-red-600 text-sm block">
                  {item.stockQuantity} {item.unit} left
                </span>
                <span className="text-[10px] text-gray-400">Min: {item.lowStockThreshold}</span>
              </div>

              {restockingId === item.id ? (
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
                  <input
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                    className="w-12 text-xs p-1 border border-gray-300 rounded-lg text-center"
                  />
                  <button
                    type="button"
                    onClick={() => handleRestock(item.id)}
                    className="px-2.5 py-1 bg-primary text-white font-bold rounded-lg text-[11px]"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setRestockingId(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ) : successId === item.id ? (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5" />
                  Restocked
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRestockingId(item.id);
                    setRestockQty(15);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 hover:border-primary text-gray-800 font-bold rounded-xl text-xs shadow-2xs hover:bg-primary-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Restock</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
