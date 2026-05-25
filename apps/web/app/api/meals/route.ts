import { NextResponse } from 'next/server';
import { eq, desc, sql } from 'drizzle-orm';
import { meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { validateMeal } from '@/lib/validation';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: Request) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(url.searchParams.get('pageSize') ?? `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE),
  );
  const offset = (page - 1) * pageSize;

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(meals)
    .where(eq(meals.userId, session.sub));
  const total = countRow?.count ?? 0;

  const rows = await db
    .select()
    .from(meals)
    .where(eq(meals.userId, session.sub))
    .orderBy(desc(meals.createdAt))
    .limit(pageSize)
    .offset(offset);

  return jsonResponse({
    data: rows,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(request: Request) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const validation = validateMeal(body);
  if (!validation.success) {
    return jsonResponse({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const [meal] = await db
    .insert(meals)
    .values({ ...validation.data!, userId: session.sub })
    .returning();

  return jsonResponse({ data: meal }, { status: 201 });
}

export { OPTIONS } from '@/lib/cors';
import { jsonResponse } from '@/lib/cors';
