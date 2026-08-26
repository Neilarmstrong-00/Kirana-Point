'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { DEFAULT_STORE_CONFIG } from '@/lib/delivery';

interface LocationMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}

export function LocationMap({
  initialLat = DEFAULT_STORE_CONFIG.storeLatitude + 0.015,
  initialLng = DEFAULT_STORE_CONFIG.storeLongitude + 0.015,
  onLocationSelect,
}: LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [currentCoords, setCurrentCoords] = useState({ lat: initialLat, lng: initialLng });
  const [isLocating, setIsLocating] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      // Fix default leaflet marker icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Store marker
        const storeIcon = L.divIcon({
          className: 'custom-store-pin',
          html: `<div style="background:#2D7A3A;color:white;padding:4px 8px;border-radius:12px;font-size:10px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏪 Store</div>`,
          iconSize: [60, 24],
        });
        L.marker([DEFAULT_STORE_CONFIG.storeLatitude, DEFAULT_STORE_CONFIG.storeLongitude], {
          icon: storeIcon,
        })
          .addTo(map)
          .bindPopup(`<b>${DEFAULT_STORE_CONFIG.storeName}</b><br/>Our Store Hub`);

        // Draggable customer marker
        const customerMarker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        customerMarker.bindPopup('Drag pin to your exact delivery location').openPopup();

        customerMarker.on('dragend', async () => {
          const pos = customerMarker.getLatLng();
          if (isMounted) {
            setCurrentCoords({ lat: pos.lat, lng: pos.lng });
            reverseGeocode(pos.lat, pos.lng);
          }
        });

        map.on('click', (e: any) => {
          customerMarker.setLatLng(e.latlng);
          if (isMounted) {
            setCurrentCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
            reverseGeocode(e.latlng.lat, e.latlng.lng);
          }
        });

        mapInstanceRef.current = map;
        markerRef.current = customerMarker;
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        setDetectedAddress(address);
        onLocationSelect({ lat, lng, address });
      } else {
        onLocationSelect({ lat, lng });
      }
    } catch {
      onLocationSelect({ lat, lng });
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS detection failed:', err);
        // Fallback to nearby store
        reverseGeocode(currentCoords.lat, currentCoords.lng);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Pinpoint Delivery Location</h4>
            <p className="text-[10px] text-gray-500">Drag the pin on the map to your doorstep</p>
          </div>
        </div>

        {/* GPS Auto Detect Button */}
        <button
          type="button"
          onClick={handleUseGPS}
          disabled={isLocating}
          className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-xl border border-primary-200/60 transition-colors disabled:opacity-50"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-200 relative">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Detected Info */}
      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-start gap-2 text-xs">
        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gray-800 block">Selected Coordinates:</span>
          <span className="text-[11px] text-gray-500">
            {detectedAddress || `Lat: ${currentCoords.lat.toFixed(4)}, Lng: ${currentCoords.lng.toFixed(4)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
