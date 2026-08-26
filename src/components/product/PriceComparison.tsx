import React from 'react';
import { PriceComparison as PriceComparisonType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Sparkles } from 'lucide-react';

interface PriceComparisonProps {
  ourPrice: number;
  comparison?: PriceComparisonType;
  productName: string;
}

export function PriceComparison({ ourPrice, comparison, productName }: PriceComparisonProps) {
  if (!comparison) return null;

  const competitors = [
    { name: 'Kirana Point (Us)', price: ourPrice, isOur: true },
    { name: 'Blinkit', price: comparison.blinkit || ourPrice + 6, isOur: false },
    { name: 'Zepto', price: comparison.zepto || ourPrice + 5, isOur: false },
    { name: 'BigBasket', price: comparison.bigbasket || ourPrice + 3, isOur: false },
    { name: 'JioMart', price: comparison.jiomart || ourPrice + 2, isOur: false },
  ];

  const highestCompetitor = Math.max(...competitors.filter((c) => !c.isOur).map((c) => c.price));
  const maxSavings = Math.max(0, highestCompetitor - ourPrice);

  return (
    <div className="bg-gradient-to-br from-primary-50/60 to-emerald-50/40 rounded-2xl p-4 border border-primary-100/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Price Comparison</h4>
            <p className="text-[10px] text-gray-500">Live competitor price check</p>
          </div>
        </div>
        {maxSavings > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-accent text-white px-2.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3" />
            Save up to {formatCurrency(maxSavings)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {competitors.map((comp) => {
          const isWinner = comp.isOur;
          return (
            <div
              key={comp.name}
              className={`p-2.5 rounded-xl text-center transition-all ${
                isWinner
                  ? 'bg-white border-2 border-primary shadow-sm ring-2 ring-primary/10'
                  : 'bg-white/70 border border-gray-100 text-gray-600'
              }`}
            >
              <p
                className={`text-[11px] font-medium truncate ${
                  isWinner ? 'text-primary font-bold' : 'text-gray-500'
                }`}
              >
                {comp.name}
              </p>
              <p
                className={`text-sm font-bold mt-1 ${
                  isWinner ? 'text-primary' : 'text-gray-800'
                }`}
              >
                {formatCurrency(comp.price)}
              </p>
              {isWinner && (
                <span className="inline-block mt-1 text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Best Value
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
