import { NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/seed-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('q');

  let list = [...INITIAL_PRODUCTS];

  if (categoryId) {
    list = list.filter((p) => p.categoryId === categoryId);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json(list);
}
