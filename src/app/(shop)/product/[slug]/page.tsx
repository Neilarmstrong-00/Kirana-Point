'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/firestore';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useMounted } from '@/hooks/useMounted';
import { PriceComparison } from '@/components/product/PriceComparison';
import { NutritionTable } from '@/components/product/NutritionTable';
import { StockBadge } from '@/components/product/StockBadge';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ChevronRight,
  Home,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const mounted = useMounted();
  const { items, addItem, updateQuantity } = useCartStore();
  const { requireAuth } = useAuthStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const prod = await getProductBySlug(slug);
      setProduct(prod);

      if (prod) {
        const all = await getProducts();
        const related = all
          .filter((p) => p.categoryId === prod.categoryId && p.id !== prod.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for is no longer available.</p>
        <Link href="/" className="inline-block text-xs font-bold text-primary hover:underline">
          ← Return to Store Home
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const cartItem = items.find((item) => item.productId === product.id);
  const inCartQty = mounted ? (cartItem?.quantity || 0) : 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      requireAuth(() => {
        addItem(product, quantity);
      }, `Please sign in or register to add ${product.name} to your cart.`);
    }
  };

  const images = product.images.length > 0 ? product.images : [{ url: '/images/placeholder.svg', altText: product.name, isPrimary: true, sortOrder: 1 }];
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/category/${product.categoryId}`} className="hover:text-primary">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-3">
          <div className="relative w-full pt-[90%] bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
            <img
              src={currentImage.url}
              alt={currentImage.altText || product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-accent text-white font-extrabold text-xs rounded-xl shadow-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails if multiple */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {product.brand}
              </span>
              <StockBadge
                stockQuantity={product.stockQuantity}
                lowStockThreshold={product.lowStockThreshold}
              />
            </div>

            <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <span className="bg-gray-100 font-semibold px-2.5 py-1 rounded-lg text-gray-800">
                Unit: {product.unitValue} {product.unit}
              </span>
              {product.barcode && <span>Barcode: {product.barcode}</span>}
              <span>SKU: {product.sku}</span>
            </div>
          </div>

          {/* Price Tag */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">
                  {formatCurrency(product.sellingPrice)}
                </span>
                {product.mrp > product.sellingPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    MRP {formatCurrency(product.mrp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-0.5">
                You save {formatCurrency(product.mrp - product.sellingPrice)} ({product.discount}%)
              </p>
            </div>

            <span className="text-[10px] text-gray-400 font-medium">Inclusive of all taxes</span>
          </div>

          {/* Price Comparison Widget */}
          <PriceComparison
            ourPrice={product.sellingPrice}
            comparison={product.priceComparison}
            productName={product.name}
          />

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-3 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-2xl p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl bg-white text-gray-700 flex items-center justify-center font-bold shadow-xs hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-extrabold text-gray-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="w-9 h-9 rounded-xl bg-white text-gray-700 flex items-center justify-center font-bold shadow-xs hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark active:scale-[0.99] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : inCartQty > 0
                  ? `Add More (${inCartQty} in Cart)`
                  : `Add ${quantity} to Cart • ${formatCurrency(product.sellingPrice * quantity)}`}
              </span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Product Overview
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              {product.description}
            </p>
          </div>

          {/* Nutrition Table & Ingredients */}
          <NutritionTable
            nutrition={product.nutritionInfo}
            ingredients={product.ingredients}
          />
        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              More from {product.categoryName}
            </h2>
            <Link
              href={`/category/${product.categoryId}`}
              className="text-xs font-bold text-primary hover:underline"
            >
              View Full Category
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
