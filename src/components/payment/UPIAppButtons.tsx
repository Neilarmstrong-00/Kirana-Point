import React from 'react';
import { PaymentLinks } from '@/lib/upi';
import { Smartphone, ExternalLink } from 'lucide-react';

interface UPIAppButtonsProps {
  links: PaymentLinks;
  amount: number;
}

export function UPIAppButtons({ links, amount }: UPIAppButtonsProps) {
  const apps = [
    {
      name: 'Google Pay',
      link: links.gpay,
      color: 'hover:border-blue-500 hover:bg-blue-50/30',
      logo: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&w=80&q=80',
      badge: 'GPay',
    },
    {
      name: 'PhonePe',
      link: links.phonepe,
      color: 'hover:border-purple-500 hover:bg-purple-50/30',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=80&q=80',
      badge: 'PhonePe',
    },
    {
      name: 'Paytm',
      link: links.paytm,
      color: 'hover:border-sky-500 hover:bg-sky-50/30',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=80&q=80',
      badge: 'Paytm',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>Tap your UPI App:</span>
        <span className="text-[11px] text-primary">Pre-fills exact amount</span>
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-3 gap-2.5">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.link}
            className={`p-3 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${app.color}`}
          >
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-700 border border-gray-100">
              {app.badge.slice(0, 2)}
            </div>
            <span className="text-xs font-bold text-gray-900">{app.badge}</span>
          </a>
        ))}
      </div>

      {/* Universal UPI Deep Link (Opens UPI Intent Picker on Android/iOS) */}
      <a
        href={links.upi}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl font-bold text-xs hover:bg-primary-dark active:scale-[0.99] transition-all shadow-md shadow-primary/20"
      >
        <Smartphone className="w-4 h-4" />
        <span>Open Any UPI App (BHIM, CRED, Navi, etc.)</span>
        <ExternalLink className="w-3.5 h-3.5 ml-1" />
      </a>
    </div>
  );
}
