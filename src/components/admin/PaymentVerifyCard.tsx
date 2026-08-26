'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, AlertCircle, Smartphone } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentVerifyCardProps {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  upiId: string;
  userClaimedAt?: string;
  onVerify: (refId?: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

export function PaymentVerifyCard({
  orderNumber,
  customerName,
  customerPhone,
  amount,
  upiId,
  userClaimedAt,
  onVerify,
  onReject,
}: PaymentVerifyCardProps) {
  const [upiRef, setUpiRef] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await onVerify(upiRef.trim() || undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return;
    setLoading(true);
    try {
      await onReject(rejectReason.trim());
    } finally {
      setLoading(false);
      setIsRejecting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border-2 border-amber-500/40 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">UPI Payment Verification</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 animate-pulse">
                Action Required
              </span>
            </div>
            <p className="text-[11px] text-gray-600">
              Customer claimed payment completed on UPI
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Payable Amount</span>
          <span className="text-lg font-extrabold text-gray-900">{formatCurrency(amount)}</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-white/80 rounded-xl p-3.5 border border-amber-200/60 text-xs text-gray-700 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Customer</span>
            <span className="font-bold text-gray-900">{customerName}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Phone</span>
            <span className="font-semibold text-gray-800">{customerPhone}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Store UPI ID Used</span>
            <span className="font-mono text-gray-800 font-medium">{upiId}</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Claimed Time</span>
            <span className="text-gray-800 font-medium">{userClaimedAt ? formatDate(userClaimedAt) : 'Just now'}</span>
          </div>
        </div>

        <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200/50 text-[11px] text-amber-900 flex items-start gap-2">
          <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Please open your bank/UPI app (GPay / PhonePe / Paytm / BHIM) and confirm receipt of <strong>{formatCurrency(amount)}</strong> from <strong>{customerName}</strong>.
          </span>
        </div>
      </div>

      {/* Action Controls */}
      {!isRejecting ? (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              UPI Transaction Reference (Optional from your UPI app receipt)
            </label>
            <input
              type="text"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              placeholder="e.g. 423589123456 or Bank UTR"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Confirm Payment</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRejecting(true)}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Not Received</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Specify Rejection Reason</span>
          </div>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Amount not credited in UPI app / Incorrect order amount"
            className="w-full text-xs p-2 rounded-lg border border-red-300 outline-none bg-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRejecting(false)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || loading}
              className="px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
