import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Nav } from '@/components/Nav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const [user] = await db
    .select({ name: users.name, role: users.role })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);

  if (!user) redirect('/login');

  return (
    <>
      <Nav userName={user.name} role={user.role} />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </>
  );
}
