import { NextResponse } from 'next/server';
import { calculateDistance, calculateDeliveryCharge, DEFAULT_STORE_CONFIG } from '@/lib/delivery';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerLat, customerLng, subtotal } = body;

    if (customerLat === undefined || customerLng === undefined) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const distance = calculateDistance(
      DEFAULT_STORE_CONFIG.storeLatitude,
      DEFAULT_STORE_CONFIG.storeLongitude,
      customerLat,
      customerLng
    );

    const result = calculateDeliveryCharge(distance, subtotal || 0, DEFAULT_STORE_CONFIG);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
