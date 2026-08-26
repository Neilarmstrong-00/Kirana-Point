'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface QRCodeDisplayProps {
  qrData: string;
  upiId: string;
  amount: number;
}

export function QRCodeDisplay({ qrData, upiId, amount }: QRCodeDisplayProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col items-center text-center space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
        <QrCode className="w-4 h-4 text-primary" />
        <span>Scan QR to Pay via Phone Camera / Scanner</span>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-xs flex flex-col items-center">
        <QRCodeSVG
          value={qrData}
          size={180}
          level="M"
          includeMargin={false}
          className="rounded-lg"
        />
        <span className="text-xs font-extrabold text-primary mt-2">
          {formatCurrency(amount)}
        </span>
      </div>

      {/* UPI Details & Copy buttons */}
      <div className="w-full space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Store UPI ID</span>
            <span className="font-mono font-bold text-gray-800 text-xs">{upiId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Copy UPI ID"
          >
            {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Payable Amount</span>
            <span className="font-bold text-gray-900 text-xs">{formatCurrency(amount)}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyAmount}
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Copy Amount"
          >
            {copiedAmount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
