import React from 'react';
import { ProductNutrition } from '@/types';
import { Activity, ShieldCheck } from 'lucide-react';

interface NutritionTableProps {
  nutrition?: ProductNutrition;
  ingredients?: string;
}

export function NutritionTable({ nutrition, ingredients }: NutritionTableProps) {
  if (!nutrition && !ingredients) return null;

  const nutrients = [
    { label: 'Energy (Calories)', value: nutrition?.energy },
    { label: 'Protein', value: nutrition?.protein },
    { label: 'Carbohydrates', value: nutrition?.carbs },
    { label: 'Total Fat', value: nutrition?.fat },
    { label: 'Dietary Fiber', value: nutrition?.fiber },
  ].filter((item) => !!item.value);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900">Nutrition Facts & Quality</h4>
          <p className="text-[10px] text-gray-500">Auto-sourced via Open Food Facts database</p>
        </div>
      </div>

      {nutrients.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {nutrients.map((item) => (
            <div key={item.label} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-500 block uppercase font-medium">{item.label}</span>
              <span className="text-xs font-bold text-gray-900 mt-0.5 block">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {ingredients && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Ingredients:</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            {ingredients}
          </p>
        </div>
      )}
    </div>
  );
}
