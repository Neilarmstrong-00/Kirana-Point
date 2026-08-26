'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/firestore';
import { Category } from '@/types';
import { CategoryCard } from '@/components/product/CategoryCard';
import { ChevronRight, Home } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">All Categories</span>
      </nav>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Browse All Grocery Categories
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore our wide selection of fresh produce, pantry staples, dairy, beverages, and personal care.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="card" />
        ))}
      </div>
    </div>
  );
}
