'use client';

import React, { useState } from 'react';
import { Home, Briefcase, MapPin, Plus, CheckCircle2 } from 'lucide-react';
import { Address } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { LocationMap } from './LocationMap';

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
}

export function AddressSelector({ selectedAddressId, onSelectAddress }: AddressSelectorProps) {
  const { addresses, addAddress } = useAuthStore();
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [label, setLabel] = useState<'home' | 'work' | 'other'>('home');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [coords, setCoords] = useState({ lat: 28.625, lng: 77.215 });

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullAddress.trim()) return;

    const newAddr = addAddress({
      label,
      fullAddress: fullAddress.trim(),
      city: city.trim() || 'New Delhi',
      pincode: pincode.trim() || '110001',
      latitude: coords.lat,
      longitude: coords.lng,
      isDefault: addresses.length === 0,
    });

    onSelectAddress(newAddr);
    setIsAddingNew(false);
    setFullAddress('');
  };

  const getIcon = (lbl: string) => {
    if (lbl === 'home') return <Home className="w-4 h-4" />;
    if (lbl === 'work') return <Briefcase className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Delivery Address
        </h3>
        {!isAddingNew && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* Saved Addresses List */}
      {!isAddingNew && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <button
                key={addr.id}
                type="button"
                onClick={() => onSelectAddress(addr)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-start gap-3 ${
                  isSelected
                    ? 'bg-primary-50/40 border-2 border-primary shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {getIcon(addr.label)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      {addr.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-700 font-medium mt-0.5 line-clamp-2">
                    {addr.fullAddress}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {addr.city} • {addr.pincode}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Add New Address Form Modal / Inline Box */}
      {isAddingNew && (
        <form
          onSubmit={handleSaveNewAddress}
          className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="text-xs font-bold text-gray-900">Add New Delivery Address</h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          {/* Label selector */}
          <div className="flex items-center gap-2">
            {(['home', 'work', 'other'] as const).map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setLabel(lbl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors flex items-center gap-1.5 ${
                  label === lbl
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getIcon(lbl)}
                <span>{lbl}</span>
              </button>
            ))}
          </div>

          {/* Full address */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Flat / House No. / Street Address *
            </label>
            <textarea
              required
              rows={2}
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="e.g. Flat 301, Sunshine Heights, Main Road"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Interactive Map Picker */}
          <LocationMap
            initialLat={coords.lat}
            initialLng={coords.lng}
            onLocationSelect={(loc) => {
              setCoords({ lat: loc.lat, lng: loc.lng });
              if (loc.address && !fullAddress) {
                setFullAddress(loc.address.slice(0, 100));
              }
            }}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-dark shadow-xs"
            >
              Save & Use Address
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
