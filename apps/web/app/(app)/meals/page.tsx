import { desc, eq } from 'drizzle-orm';
import { meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { MealsClient } from '@/components/MealsClient';

export default async function MealsPage() {
  const session = (await getSession())!;

  const rows = await db
    .select()
    .from(meals)
    .where(eq(meals.userId, session.sub))
    .orderBy(desc(meals.createdAt));

  return <MealsClient initialMeals={rows} />;
}
