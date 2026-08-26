import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data?: { date: string; revenue: number; orders: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Generate last 7 days trend if not passed
  const days = data || [
    { date: '20 Aug', revenue: 4200, orders: 8 },
    { date: '21 Aug', revenue: 5850, orders: 11 },
    { date: '22 Aug', revenue: 6400, orders: 13 },
    { date: '23 Aug', revenue: 4900, orders: 9 },
    { date: '24 Aug', revenue: 7800, orders: 15 },
    { date: '25 Aug', revenue: 8200, orders: 16 },
    { date: 'Today', revenue: 8450, orders: 12 },
  ];

  const maxRevenue = Math.max(...days.map((d) => d.revenue));
  const totalRevenue = days.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Revenue Trend (Last 7 Days)
          </h4>
          <p className="text-[11px] text-gray-500">Total: {formatCurrency(totalRevenue)}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+18.4% this week</span>
        </div>
      </div>

      {/* Bar Chart Visualizer */}
      <div className="pt-4 flex items-end justify-between gap-2 h-40">
        {days.map((item) => {
          const heightPercent = Math.max(15, Math.round((item.revenue / maxRevenue) * 100));
          const isToday = item.date === 'Today';

          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded shadow-xs">
                {formatCurrency(item.revenue)}
              </div>
              <div className="w-full bg-gray-100 rounded-xl overflow-hidden h-28 flex items-end">
                <div
                  className={`w-full rounded-xl transition-all duration-500 ${
                    isToday ? 'bg-primary shadow-xs' : 'bg-primary-200 group-hover:bg-primary-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  isToday ? 'text-primary font-bold' : 'text-gray-400'
                }`}
              >
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
