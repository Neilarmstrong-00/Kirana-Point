'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { getCategories, getProducts } from '@/lib/firestore';
import { Category, Product } from '@/types';
import { CategoryCard } from '@/components/product/CategoryCard';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts().then(setProducts);
  }, []);

  const heroSlides = [
    {
      title: 'Fresh Essentials Delivered To Your Doorstep',
      subtitle: 'From local farm produce to trusted daily staples, enjoy pure quality at wholesale-grade prices.',
      tag: '🚀 Superfast Delivery',
      bgGradient: 'from-emerald-900 via-green-800 to-primary-dark',
      buttonText: 'Shop Daily Essentials',
      link: '/category/staples-grains',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Zero Gateway Fees. 100% Direct UPI Payments.',
      subtitle: 'Pay directly to your neighbourhood kirana via Google Pay, PhonePe, or Paytm with instant verification.',
      tag: '💳 ₹0 Platform Fees',
      bgGradient: 'from-slate-900 via-primary-900 to-primary-dark',
      buttonText: 'Explore Today’s Deals',
      link: '/category/fruits-vegetables',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Free Delivery On All Orders Above ₹2,000',
      subtitle: 'Distance-based fee of just ₹5/km for smaller orders. Fast and transparent pricing.',
      tag: '🎁 Special Offer',
      bgGradient: 'from-amber-900 via-emerald-900 to-primary-900',
      buttonText: 'View Dairy & Snacks',
      link: '/category/dairy-eggs',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const dailyDeals = products.filter((p) => p.isDailyDeal || p.discount >= 15).slice(0, 8);
  const bestSellers = products.filter((p) => p.isFeatured || p.stockQuantity > 20).slice(0, 8);

  const currentSlide = heroSlides[activeSlide];

  return (
    <div className="space-y-10 pb-8">
      {/* Hero Carousel */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 min-h-[340px] sm:min-h-[400px] flex items-center">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentSlide.bgGradient} transition-all duration-700`}
        />
        {/* Background Overlay Image with subtle opacity */}
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />

        <div className="relative z-10 p-6 sm:p-12 max-w-2xl text-white space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/20 text-white">
            <Sparkles className="w-3.5 h-3.5 text-accent-100" />
            <span>{currentSlide.tag}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white tracking-tight">
            {currentSlide.title}
          </h1>

          <p className="text-xs sm:text-base text-gray-200 leading-relaxed max-w-xl">
            {currentSlide.subtitle}
          </p>

          <div className="pt-2">
            <Link
              href={currentSlide.link}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white font-bold text-xs sm:text-sm hover:bg-accent-dark active:scale-95 transition-all shadow-md shadow-accent/20"
            >
              <span>{currentSlide.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Grid / Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-xs text-gray-500">Handpicked essentials organized for quick grocery runs</p>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Today's Special Deals */}
      <section className="bg-gradient-to-br from-amber-50/50 via-white to-primary-50/30 rounded-3xl p-5 sm:p-8 border border-amber-200/50 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center shadow-md shadow-accent/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Today's Super Deals
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-accent-100 text-accent-dark rounded-full">
                  Up to 30% OFF
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Exclusive daily discounts on pantry staples and fresh vegetables
              </p>
            </div>
          </div>

          <Link
            href="/category/fruits-vegetables"
            className="text-xs font-bold text-accent-dark hover:underline flex items-center gap-1"
          >
            <span>Explore All Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {dailyDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers & Most Loved */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Daily Best Sellers</h2>
            <p className="text-xs text-gray-500">Most purchased daily essentials in your neighbourhood</p>
          </div>
          <Link
            href="/category/staples-grains"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span>See More</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust & Local Neighbourhood Store Banner */}
      <section className="bg-primary text-white rounded-3xl p-6 sm:p-10 shadow-md shadow-primary/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <Clock className="w-6 h-6 text-accent-100" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Fast Local Dispatch</h3>
            <p className="text-xs text-primary-100 mt-1 leading-relaxed">
              Dispatched straight from our physical store in 30-45 minutes. No central warehouse delays.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <ShieldCheck className="w-6 h-6 text-accent-100" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Quality Guaranteed</h3>
            <p className="text-xs text-primary-100 mt-1 leading-relaxed">
              Every item is inspected by hand. Cleaned fresh vegetables, fresh unexpired dairy and packaged goods.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <CheckCircle2 className="w-6 h-6 text-accent-100" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Transparent Pricing</h3>
            <p className="text-xs text-primary-100 mt-1 leading-relaxed">
              Honest distance delivery fees of ₹5/km with zero hidden platform markups or gateway fees.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
