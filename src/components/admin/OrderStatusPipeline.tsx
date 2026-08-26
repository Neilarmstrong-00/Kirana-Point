import React from 'react';
import { OrderStatus } from '@/types';
import { Check, Clock, PackageCheck, Truck, Store, XCircle } from 'lucide-react';

interface OrderStatusPipelineProps {
  currentStatus: OrderStatus;
  deliveryType: 'delivery' | 'pickup';
  onStatusChange: (newStatus: OrderStatus) => void;
  isReadOnly?: boolean;
}

export function OrderStatusPipeline({
  currentStatus,
  deliveryType,
  onStatusChange,
  isReadOnly = false,
}: OrderStatusPipelineProps) {
  const isDelivery = deliveryType === 'delivery';

  const steps: { key: OrderStatus; label: string; icon: any }[] = isDelivery
    ? [
        { key: 'confirmed', label: 'Confirmed', icon: Check },
        { key: 'preparing', label: 'Preparing / Packing', icon: PackageCheck },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: Check },
      ]
    : [
        { key: 'confirmed', label: 'Confirmed', icon: Check },
        { key: 'preparing', label: 'Preparing Order', icon: PackageCheck },
        { key: 'ready_for_pickup', label: 'Ready for Pickup', icon: Store },
        { key: 'picked_up', label: 'Picked Up', icon: Check },
      ];

  const statusOrder = [
    'pending',
    'awaiting_payment',
    'payment_verifying',
    'confirmed',
    'preparing',
    isDelivery ? 'out_for_delivery' : 'ready_for_pickup',
    isDelivery ? 'delivered' : 'picked_up',
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Order Status Pipeline
        </h4>
        {isCancelled ? (
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            Order Cancelled
          </span>
        ) : (
          <span className="text-xs font-bold text-primary bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200 capitalize">
            Current: {currentStatus.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      {/* Stepper visualization */}
      {!isCancelled && (
        <div className="grid grid-cols-4 gap-2 pt-2">
          {steps.map((step, idx) => {
            const stepIndex = statusOrder.indexOf(step.key);
            const isCompleted = currentIndex >= stepIndex;
            const isCurrent = currentStatus === step.key;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-primary-50 border-primary shadow-xs ring-2 ring-primary/20'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold tracking-tight text-gray-900">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Advance Action Buttons for Admin */}
      {!isReadOnly && !isCancelled && (
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-gray-500 font-medium">Update Status:</span>
          <div className="flex flex-wrap gap-2">
            {currentStatus === 'confirmed' && (
              <button
                type="button"
                onClick={() => onStatusChange('preparing')}
                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-xs"
              >
                Mark as Preparing 📦
              </button>
            )}

            {currentStatus === 'preparing' && (
              <button
                type="button"
                onClick={() => onStatusChange(isDelivery ? 'out_for_delivery' : 'ready_for_pickup')}
                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-xs"
              >
                {isDelivery ? 'Dispatch Out for Delivery 🚚' : 'Mark Ready for Pickup 🏪'}
              </button>
            )}

            {(currentStatus === 'out_for_delivery' || currentStatus === 'ready_for_pickup') && (
              <button
                type="button"
                onClick={() => onStatusChange(isDelivery ? 'delivered' : 'picked_up')}
                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-xs"
              >
                {isDelivery ? 'Mark as Delivered ✅' : 'Mark as Picked Up ✅'}
              </button>
            )}

            <button
              type="button"
              onClick={() => onStatusChange('cancelled')}
              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200"
            >
              Cancel Order ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
