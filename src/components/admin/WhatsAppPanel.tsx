'use client';

import React, { useState } from 'react';
import { MessageSquare, ExternalLink, Check, Copy } from 'lucide-react';
import { generateOrderConfirmationLink, generateStatusUpdateLink } from '@/lib/whatsapp';
import { Order } from '@/types';

interface WhatsAppPanelProps {
  order: Order;
  onMarkSent?: () => void;
}

export function WhatsAppPanel({ order, onMarkSent }: WhatsAppPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(order.whatsappSent);

  const confirmationLink = generateOrderConfirmationLink({
    customerPhone: order.userPhone,
    orderNumber: order.orderNumber,
    customerName: order.userName,
    items: order.items.map((i) => ({
      name: i.productNameSnapshot,
      quantity: i.quantity,
      price: i.priceSnapshot,
    })),
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    total: order.total,
    deliveryType: order.deliveryType,
  });

  const statusLink = generateStatusUpdateLink(
    order.userPhone,
    order.userName,
    order.orderNumber,
    order.status
  );

  const activeLink = order.status === 'confirmed' ? confirmationLink : statusLink;

  const handleSendClick = () => {
    window.open(activeLink, '_blank');
    setIsSent(true);
    if (onMarkSent) onMarkSent();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">WhatsApp Notification Drafter</h4>
            <p className="text-[10px] text-gray-500">100% Free wa.me click-to-chat integration</p>
          </div>
        </div>

        {isSent && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" />
            Sent to Customer
          </span>
        )}
      </div>

      {/* Customer Info */}
      <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-gray-400 block text-[10px]">Recipient Phone</span>
          <span className="font-semibold text-gray-900">+91 {order.userPhone}</span>
        </div>
        <div className="text-right">
          <span className="text-gray-400 block text-[10px]">Recipient Name</span>
          <span className="font-semibold text-gray-900">{order.userName}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleSendClick}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            {order.status === 'confirmed'
              ? 'Send Order Confirmation on WhatsApp'
              : `Send '${order.status.replace(/_/g, ' ')}' Update on WhatsApp`}
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          Opens WhatsApp Web or App with pre-formatted invoice summary ready to send with 1 click.
        </p>
      </div>
    </div>
  );
}
