export interface WhatsAppOrderParams {
  customerPhone: string;
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  estimatedTime?: string;
}

function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Generates WhatsApp order confirmation link with formatted message
 */
export function generateOrderConfirmationLink(params: WhatsAppOrderParams): string {
  const {
    customerPhone,
    orderNumber,
    customerName,
    items,
    subtotal,
    deliveryCharge,
    total,
    deliveryType,
    estimatedTime,
  } = params;

  let message = `🟢 *Kirana Point — Order Confirmed!*\n\n`;
  message += `Hi *${customerName}*! 👋\n`;
  message += `Thank you for choosing Kirana Point. Your order has been placed.\n\n`;
  message += `📋 *Order Number:* ${orderNumber}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;

  items.forEach((item) => {
    message += `• ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Subtotal: ₹${subtotal}\n`;

  if (deliveryCharge > 0) {
    message += `Delivery Fee: ₹${deliveryCharge}\n`;
  } else if (deliveryType === 'delivery') {
    message += `Delivery Fee: *FREE* ✅\n`;
  }

  message += `*Grand Total: ₹${total}*\n\n`;

  if (deliveryType === 'delivery') {
    message += `🚚 *Delivery Mode:* Home Delivery (${estimatedTime || '30-45 minutes'})\n`;
  } else {
    message += `🏪 *Delivery Mode:* Store Pickup (Ready in ~20 minutes)\n`;
  }

  message += `\nNeed help? Reply to this message.\n*Kirana Point* — *Your neighbourhood store, now online.* 🙏`;

  const phone = cleanPhone(customerPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp status update link
 */
export function generateStatusUpdateLink(
  customerPhone: string,
  customerName: string,
  orderNumber: string,
  status: string
): string {
  const statusMessages: Record<string, string> = {
    preparing: `🟢 *Kirana Point Update*\n\nHi ${customerName}! 👋\nYour order *${orderNumber}* is now being packed and prepared carefully. 📦`,
    out_for_delivery: `🟢 *Kirana Point Update*\n\nHi ${customerName}! 🚚\nYour order *${orderNumber}* is OUT FOR DELIVERY! Our delivery partner will reach you shortly.`,
    ready_for_pickup: `🟢 *Kirana Point Update*\n\nHi ${customerName}! 🏪\nYour order *${orderNumber}* is READY FOR PICKUP at our store counter.`,
    delivered: `🟢 *Kirana Point Update*\n\nHi ${customerName}! 🎉\nYour order *${orderNumber}* has been successfully DELIVERED. Thank you for shopping with us! Have a wonderful day! 🙏`,
    cancelled: `🟢 *Kirana Point Notice*\n\nHi ${customerName}, your order *${orderNumber}* has been CANCELLED. If you made an online UPI payment, the refund will be processed back to your UPI account.`,
  };

  const message =
    statusMessages[status] ||
    `🟢 *Kirana Point Update*\n\nHi ${customerName}! Order *${orderNumber}* status updated to: ${status}`;

  const phone = cleanPhone(customerPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Direct query/support message generator
 */
export function generateCustomerSupportLink(storePhone: string, orderNumber?: string): string {
  const phone = cleanPhone(storePhone);
  const text = orderNumber
    ? `Hi Kirana Point! I have a question regarding my order #${orderNumber}.`
    : `Hi Kirana Point! I would like to inquire about products in your store.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
