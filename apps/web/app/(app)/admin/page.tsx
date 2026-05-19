import { desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { AdminClient } from '@/components/AdminClient';

export default async function AdminPage() {
  const session = (await getSession())!;
  if (session.role !== 'admin') redirect('/dashboard');

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return <AdminClient users={rows} currentUserId={session.sub} />;
}
