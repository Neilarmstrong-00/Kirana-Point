'use client';

import React, { useState, useEffect } from 'react';
import { getCategories, saveCategory, deleteCategory, getProducts } from '@/lib/firestore';
import { Category } from '@/types';
import { slugify, generateId } from '@/lib/utils';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Wheat,
  Milk,
  Apple,
  Droplet,
  Coffee,
  Flame,
  Sparkles,
  HeartHandshake,
  Package,
} from 'lucide-react';

const availableIcons = [
  'Wheat',
  'Milk',
  'Apple',
  'Droplet',
  'Coffee',
  'Flame',
  'Sparkles',
  'HeartHandshake',
  'Package',
];

const iconComponentMap: Record<string, any> = {
  Wheat,
  Milk,
  Apple,
  Droplet,
  Coffee,
  Flame,
  Sparkles,
  HeartHandshake,
  Package,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Package');
  const [image, setImage] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  const loadCategories = async () => {
    setLoading(true);
    const [cats, prods] = await Promise.all([getCategories(), getProducts()]);

    // Recalculate dynamic product counts
    const updated = cats.map((cat) => ({
      ...cat,
      productCount: prods.filter((p) => p.categoryId === cat.id).length,
    }));
    setCategories(updated);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setIconName('Wheat');
    setImage('');
    setSortOrder(categories.length + 1);
    setIsEditing(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setIconName(cat.iconName);
    setImage(cat.image || '');
    setSortOrder(cat.sortOrder || 1);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: Category = {
      id: editId || `cat_${generateId('cat')}`,
      name: name.trim(),
      slug: slugify(name),
      iconName,
      image: image.trim() || undefined,
      sortOrder: Number(sortOrder),
      isActive: true,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };

    await saveCategory(newCategory);
    setIsEditing(false);
    loadCategories();
  };

  const handleDelete = async (id: string, count: number) => {
    if (count > 0) {
      alert(`Cannot delete this category because it contains ${count} product(s). Move or delete the products first.`);
      return;
    }
    if (confirm('Delete this category?')) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-xs text-gray-500">
            Organize aisles and departments for the online store.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark flex items-center gap-1.5 shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Add / Edit Form Modal Box */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-gray-900">
              {editId ? 'Edit Category' : 'Create New Category'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atta, Rice & Dals"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Icon Representation
              </label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map((ic) => {
                  const Icon = iconComponentMap[ic] || Package;
                  return (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIconName(ic)}
                      className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-colors ${
                        iconName === ic
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{ic}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category Cover Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-dark shadow-xs"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = iconComponentMap[cat.iconName] || Package;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{cat.name}</h3>
                  <span className="text-[11px] text-gray-400 block">
                    {cat.productCount || 0} product{(cat.productCount || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[10px] font-mono text-gray-400">slug: /{cat.slug}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-primary hover:text-white text-gray-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.productCount || 0)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-600 hover:text-white text-gray-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
