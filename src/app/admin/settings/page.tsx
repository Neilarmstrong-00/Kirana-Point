'use client';

import React, { useState, useEffect } from 'react';
import { getStoreConfig, updateStoreConfig } from '@/lib/firestore';
import { StoreConfig } from '@/types';
import { LocationMap } from '@/components/checkout/LocationMap';
import {
  Settings,
  Store,
  CreditCard,
  MessageSquare,
  Truck,
  Clock,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeLatitude, setStoreLatitude] = useState(20.6865);
  const [storeLongitude, setStoreLongitude] = useState(76.5654);
  const [deliveryRatePerKm, setDeliveryRatePerKm] = useState(5);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(2000);
  const [maxDeliveryRadiusKm, setMaxDeliveryRadiusKm] = useState(15);
  const [minDeliveryCharge, setMinDeliveryCharge] = useState(20);
  const [operatingHours, setOperatingHours] = useState('7:00 AM – 10:00 PM');
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [upiId, setUpiId] = useState('8208232735@axl');
  const [upiDisplayName, setUpiDisplayName] = useState('Pratham Tarde (Kirana Point)');
  const [whatsappNumber, setWhatsappNumber] = useState('918208232735');

  useEffect(() => {
    getStoreConfig().then((conf) => {
      setConfig(conf);
      setStoreName(conf.storeName);
      setStorePhone(conf.storePhone);
      setStoreEmail(conf.storeEmail);
      setStoreAddress(conf.storeAddress);
      setStoreLatitude(conf.storeLatitude);
      setStoreLongitude(conf.storeLongitude);
      setDeliveryRatePerKm(conf.deliveryRatePerKm);
      setFreeDeliveryThreshold(conf.freeDeliveryThreshold);
      setMaxDeliveryRadiusKm(conf.maxDeliveryRadiusKm);
      setMinDeliveryCharge(conf.minDeliveryCharge || 20);
      setOperatingHours(conf.operatingHours);
      setIsStoreOpen(conf.isStoreOpen);
      setUpiId(conf.upiId);
      setUpiDisplayName(conf.upiDisplayName);
      setWhatsappNumber(conf.whatsappNumber);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreConfig({
        storeName: storeName.trim(),
        storePhone: storePhone.trim(),
        storeEmail: storeEmail.trim(),
        storeAddress: storeAddress.trim(),
        storeLatitude: Number(storeLatitude),
        storeLongitude: Number(storeLongitude),
        deliveryRatePerKm: Number(deliveryRatePerKm),
        freeDeliveryThreshold: Number(freeDeliveryThreshold),
        maxDeliveryRadiusKm: Number(maxDeliveryRadiusKm),
        minDeliveryCharge: Number(minDeliveryCharge),
        operatingHours: operatingHours.trim(),
        isStoreOpen,
        upiId: upiId.trim(),
        upiDisplayName: upiDisplayName.trim(),
        whatsappNumber: whatsappNumber.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating store settings:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Store Settings & Configuration
          </h1>
          <p className="text-xs text-gray-500">
            Configure UPI IDs, delivery pricing tiers, WhatsApp contact, and store location.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Store Identity & Operational Status */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              1. Store Identity & Timings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="e.g. 7:00 AM – 10:00 PM"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Store Phone</label>
              <input
                type="tel"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Store Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Store Open Status</label>
              <button
                type="button"
                onClick={() => setIsStoreOpen(!isStoreOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isStoreOpen
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {isStoreOpen ? '🟢 Store is Open (Accepting Orders)' : '🔴 Store is Closed'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Direct UPI Payment Settings */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              2. UPI Payment Settings (₹0 Fees)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store UPI ID (Where customers pay) *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. kiranapoint@okaxis or 9876543210@paytm"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                UPI Payee Display Name
              </label>
              <input
                type="text"
                value={upiDisplayName}
                onChange={(e) => setUpiDisplayName(e.target.value)}
                placeholder="Kirana Point"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. WhatsApp Integration */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              3. WhatsApp Notification Settings
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin WhatsApp Number (Country code + phone without +) *
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="919876543210"
              className="w-full sm:w-1/2 text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-mono"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used when customers click "Message Store on WhatsApp".
            </p>
          </div>
        </div>

        {/* 4. Delivery & Pricing Rules + Map Location */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              4. Delivery Pricing & Store GPS Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Rate per KM (₹)
              </label>
              <input
                type="number"
                value={deliveryRatePerKm}
                onChange={(e) => setDeliveryRatePerKm(parseFloat(e.target.value) || 5)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(parseFloat(e.target.value) || 2000)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Min Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={minDeliveryCharge}
                onChange={(e) => setMinDeliveryCharge(parseFloat(e.target.value) || 20)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Max Radius (KM)
              </label>
              <input
                type="number"
                value={maxDeliveryRadiusKm}
                onChange={(e) => setMaxDeliveryRadiusKm(parseFloat(e.target.value) || 15)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none font-bold"
              />
            </div>

            <div className="col-span-2 sm:col-span-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Physical Store Address *
              </label>
              <input
                type="text"
                required
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Interactive Map Picker for Store Location */}
          <div className="pt-2">
            <span className="block text-xs font-semibold text-gray-700 mb-2">
              Pin Exact Physical Store Location (Used for Haversine calculations)
            </span>
            <LocationMap
              initialLat={storeLatitude}
              initialLng={storeLongitude}
              onLocationSelect={(loc) => {
                setStoreLatitude(loc.lat);
                setStoreLongitude(loc.lng);
              }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Store settings updated successfully!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
