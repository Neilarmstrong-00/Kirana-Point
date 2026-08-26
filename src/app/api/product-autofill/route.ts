import { NextResponse } from 'next/server';
import { autoFillProduct } from '@/lib/product-autofill';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brand, name, weight, barcode } = body;

    if (!name && !barcode) {
      return NextResponse.json({ error: 'Product name or barcode is required' }, { status: 400 });
    }

    const result = await autoFillProduct({ brand, name, weight, barcode });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
