import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/seed-data';

export async function GET() {
  return NextResponse.json(INITIAL_CATEGORIES);
}
