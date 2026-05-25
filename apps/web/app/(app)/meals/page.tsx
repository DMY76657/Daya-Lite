import { desc, eq, sql } from 'drizzle-orm';
import { meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { MealsClient } from '@/components/MealsClient';

const PAGE_SIZE = 20;

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = (await getSession())!;
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(meals)
    .where(eq(meals.userId, session.sub));
  const total = countRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const rows = await db
    .select()
    .from(meals)
    .where(eq(meals.userId, session.sub))
    .orderBy(desc(meals.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  return (
    <MealsClient
      initialMeals={rows}
      pagination={{ page, totalPages, total }}
    />
  );
}
