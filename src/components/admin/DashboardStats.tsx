import React from 'react';
import { ShoppingBag, IndianRupee, CreditCard, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStatsProps {
  todayOrdersCount: number;
  todayRevenue: number;
  pendingPaymentsCount: number;
  lowStockCount: number;
}

export function DashboardStats({
  todayOrdersCount,
  todayRevenue,
  pendingPaymentsCount,
  lowStockCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Orders Today',
      value: todayOrdersCount.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      label: "Today's Revenue",
      value: formatCurrency(todayRevenue),
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      label: 'Pending UPI Verifications',
      value: pendingPaymentsCount.toString(),
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      badge: pendingPaymentsCount > 0 ? 'Requires Action' : undefined,
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-700 border-red-200',
      iconBg: 'bg-red-600 text-white',
      badge: lowStockCount > 0 ? 'Urgent' : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`p-4 sm:p-5 rounded-2xl border bg-white shadow-xs flex items-center justify-between transition-all hover:shadow-md`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1.5">
                {item.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.iconBg} shadow-sm`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
