export interface UPILinkParams {
  upiId: string;
  payeeName: string;
  amount: number;
  orderNumber: string;
  note?: string;
}

export interface PaymentLinks {
  upi: string;
  gpay: string;
  phonepe: string;
  paytm: string;
  qrData: string;
}

/**
 * Generates standard UPI universal deep link
 */
export function generateUPIDeepLink(params: UPILinkParams): string {
  const { upiId, payeeName, amount, orderNumber, note } = params;
  const transactionNote = note || `Order ${orderNumber}`;

  const query = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: transactionNote,
    tr: orderNumber,
  });

  return `upi://pay?${query.toString()}`;
}

/**
 * Generates app-specific and universal payment intent links
 */
export function generatePaymentLinks(params: UPILinkParams): PaymentLinks {
  const baseLink = generateUPIDeepLink(params);
  const note = params.note || `Order ${params.orderNumber}`;
  const webParams = `pa=${encodeURIComponent(params.upiId)}&pn=${encodeURIComponent(
    params.payeeName
  )}&am=${params.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(
    params.orderNumber
  )}`;

  return {
    upi: baseLink,
    gpay: `tez://upi/pay?${webParams}`,
    phonepe: `phonepe://pay?${webParams}`,
    paytm: `paytmmp://pay?${webParams}`,
    qrData: baseLink,
  };
}
