'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, getStockLogs, restockProduct } from '@/lib/firestore';
import { Product, StockLog } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StockBadge } from '@/components/product/StockBadge';
import {
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  History,
  CheckCircle2,
  Package,
} from 'lucide-react';

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'logs'>('inventory');

  const loadData = async () => {
    setLoading(true);
    const [prods, logs] = await Promise.all([getProducts(), getStockLogs()]);
    setProducts(prods);
    setStockLogs(logs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickRestock = async (productId: string, qty: number) => {
    await restockProduct(productId, qty, 'Store Manager', 'Manual Stock Top-up');
    loadData();
  };

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stockQuantity > p.lowStockThreshold).length;
  const lowStock = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  ).length;
  const outOfStock = products.filter((p) => p.stockQuantity <= 0).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Stock & Inventory Desk
          </h1>
          <p className="text-xs text-gray-500">
            Monitor real-time inventory counts, replenish low stock items, and review stock logs.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Total SKUs</span>
          <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">{totalProducts}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Healthy In-Stock</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">{inStock}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-xs font-semibold text-amber-800">Low Stock Alerts</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-800 mt-1">{lowStock}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-xs">
          <span className="text-xs font-semibold text-red-600">Out of Stock</span>
          <p className="text-xl sm:text-2xl font-extrabold text-red-600 mt-1">{outOfStock}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'inventory'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Inventory Items & Quick Restock
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Stock Audit Log ({stockLogs.length})</span>
        </button>
      </div>

      {/* Content depending on tab */}
      {activeTab === 'inventory' ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Min Alert Threshold</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]?.url || '/images/placeholder.svg'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-50 border border-gray-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block truncate max-w-[200px]">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono">
                            {p.sku} • {p.unitValue} {p.unit}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-700">{p.categoryName}</td>

                    <td className="p-4 font-extrabold text-sm text-gray-900">
                      {p.stockQuantity} {p.unit}
                    </td>

                    <td className="p-4 text-gray-500">
                      {p.lowStockThreshold} {p.unit}
                    </td>

                    <td className="p-4">
                      <StockBadge
                        stockQuantity={p.stockQuantity}
                        lowStockThreshold={p.lowStockThreshold}
                      />
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickRestock(p.id, 10)}
                          className="px-2.5 py-1 bg-primary text-white hover:bg-primary-dark rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickRestock(p.id, 25)}
                          className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          +25
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickRestock(p.id, 50)}
                          className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {stockLogs.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400">No stock logs yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Quantity Change</th>
                    <th className="p-4">Before / After</th>
                    <th className="p-4">Reason & Actor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stockLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-500">{formatDate(log.createdAt)}</td>
                      <td className="p-4 font-bold text-gray-900">{log.productName}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.action === 'order_placed'
                              ? 'bg-blue-50 text-blue-700'
                              : log.action === 'restock'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-mono font-extrabold ${
                            log.quantityChange > 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 font-mono">
                        {log.stockBefore} → {log.stockAfter}
                      </td>
                      <td className="p-4">
                        <span className="text-gray-900 block font-medium">{log.reason}</span>
                        <span className="text-[10px] text-gray-400">{log.performedBy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
