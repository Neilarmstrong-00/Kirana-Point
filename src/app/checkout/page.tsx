'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { DeliveryTypePicker } from '@/components/checkout/DeliveryTypePicker';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { DeliveryChargeCard } from '@/components/checkout/DeliveryChargeCard';
import { createOrder } from '@/lib/firestore';
import { generateOrderNumber, formatCurrency } from '@/lib/utils';
import { Order, PaymentMethod } from '@/types';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  CheckCircle2,
  Phone,
  User as UserIcon,
  ShoppingBag,
  Home,
  ChevronRight,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, deliveryType, getSubtotal, getDiscountTotal, getDeliveryCalculation, getFinalTotal, clearCart } =
    useCartStore();
  const { user, addresses, selectedAddressId, setSelectedAddressId, isAuthenticated, openAuthModal } =
    useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || null;

  const subtotal = getSubtotal();
  const discountTotal = getDiscountTotal();
  const deliveryResult = getDeliveryCalculation(selectedAddress);
  const finalTotal = getFinalTotal(selectedAddress);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/" className="inline-block text-xs font-bold text-primary hover:underline">
          ← Return to Store Home
        </Link>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-primary-100 text-primary flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Sign In to Complete Order
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart ({formatCurrency(finalTotal)}). Please log in or create an account to proceed with address selection and payment.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openAuthModal('Please sign in or register to place your order.')}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3.5 px-4 rounded-2xl text-xs font-bold shadow-md shadow-primary/20 transition-all"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In / Register to Checkout</span>
          </button>

          <Link
            href="/cart"
            className="block text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (deliveryType === 'delivery' && !deliveryResult.isServiceable) {
      alert('Your delivery address is beyond our 15km service radius. Please choose Store Pickup instead.');
      return;
    }

    if (!customerPhone.trim()) {
      alert('Please enter your WhatsApp phone number to receive order updates.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        userId: user?.uid || `guest_${Date.now()}`,
        userName: customerName.trim(),
        userEmail: user?.email || 'customer@example.com',
        userPhone: customerPhone.trim(),
        status: paymentMethod === 'upi' ? 'awaiting_payment' : 'confirmed',
        statusHistory: [
          {
            status: paymentMethod === 'upi' ? 'awaiting_payment' : 'confirmed',
            changedAt: new Date().toISOString(),
            changedBy: customerName.trim(),
            note: `Order placed via ${paymentMethod.toUpperCase()}`,
          },
        ],
        deliveryType,
        addressSnapshot: deliveryType === 'delivery' && selectedAddress ? selectedAddress : undefined,
        deliveryDetail:
          deliveryType === 'delivery'
            ? {
                storeLat: DEFAULT_STORE_CONFIG.storeLatitude,
                storeLng: DEFAULT_STORE_CONFIG.storeLongitude,
                customerLat: selectedAddress?.latitude || DEFAULT_STORE_CONFIG.storeLatitude,
                customerLng: selectedAddress?.longitude || DEFAULT_STORE_CONFIG.storeLongitude,
                distanceKm: deliveryResult.distanceKm,
                chargePerKm: DEFAULT_STORE_CONFIG.deliveryRatePerKm,
                calculatedCharge: deliveryResult.calculatedCharge,
                finalCharge: deliveryResult.finalCharge,
                isFreeDelivery: deliveryResult.isFreeDelivery,
                freeDeliveryReason: deliveryResult.freeDeliveryReason,
              }
            : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          productNameSnapshot: item.productName,
          productImageSnapshot: item.productImage,
          priceSnapshot: item.sellingPrice,
          mrpSnapshot: item.mrp,
          quantity: item.quantity,
          unit: item.unit,
          unitValue: item.unitValue,
          lineTotal: item.sellingPrice * item.quantity,
        })),
        subtotal,
        deliveryCharge: deliveryType === 'delivery' ? deliveryResult.finalCharge : 0,
        discount: discountTotal,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'upi' ? 'pending' : 'pending',
        whatsappSent: false,
        notes: orderNotes.trim() || undefined,
        placedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createOrder(newOrder);
      clearCart();

      if (paymentMethod === 'upi') {
        router.push(`/checkout/payment/${newOrder.id}`);
      } else {
        router.push(`/orders/${newOrder.id}/confirmed`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/cart" className="hover:text-primary">
          Cart
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold">Secure Checkout</span>
      </nav>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Complete Your Order
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Select delivery method, address, and your preferred payment option.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 items-start">
        {/* Left 2 Columns: Checkout Steps */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Step 1: Delivery Mode */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h2 className="text-sm font-bold text-gray-900">Fulfilment Method</h2>
            </div>

            <DeliveryTypePicker />
          </div>

          {/* Step 2: Address & Location Map (if Delivery) */}
          {deliveryType === 'delivery' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h2 className="text-sm font-bold text-gray-900">Delivery Address & Map Pin</h2>
              </div>

              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelectAddress={(addr) => setSelectedAddressId(addr.id)}
              />

              <DeliveryChargeCard
                deliveryResult={deliveryResult}
                deliveryType={deliveryType}
              />
            </div>
          )}

          {/* Step 3: Customer Contact (for WhatsApp Invoice) */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {deliveryType === 'delivery' ? 3 : 2}
              </div>
              <h2 className="text-sm font-bold text-gray-900">
                Customer & WhatsApp Notifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  WhatsApp Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit WhatsApp number"
                    className="w-full text-xs p-2.5 pl-9 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Leave with security guard / Ring doorbell twice"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {deliveryType === 'delivery' ? 4 : 3}
              </div>
              <h2 className="text-sm font-bold text-gray-900">Payment Option</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative ${
                  paymentMethod === 'upi'
                    ? 'bg-primary-50/50 border-2 border-primary shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'upi'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Direct UPI Payment</span>
                    {paymentMethod === 'upi' && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    GPay, PhonePe, Paytm or QR Code. <strong>₹0 platform fee</strong>.
                  </p>
                </div>
              </button>

              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative ${
                  paymentMethod === 'cod'
                    ? 'bg-primary-50/50 border-2 border-primary shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Cash on Delivery</span>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Pay with physical cash or scanner upon {deliveryType === 'delivery' ? 'delivery' : 'pickup'}.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary & Submit Button */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({items.length})
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-xs text-gray-600">
                  <span className="truncate max-w-[170px]">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {deliveryType === 'pickup' || deliveryResult.isFreeDelivery ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    <strong className="text-gray-900">
                      {formatCurrency(deliveryResult.finalCharge)}
                    </strong>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 items-baseline">
                <span className="text-sm font-bold text-gray-900">Grand Total</span>
                <span className="text-xl font-extrabold text-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Placing Order...'
                  : paymentMethod === 'upi'
                  ? `Proceed to Pay ${formatCurrency(finalTotal)}`
                  : `Place COD Order • ${formatCurrency(finalTotal)}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Direct Store Guarantee & Live Tracking</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
