import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ProfileClient } from '@/components/ProfileClient';

export default async function ProfilePage() {
  const session = (await getSession())!;

  const [user] = await db
    .select({
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);

  if (!user) redirect('/login');

  return <ProfileClient user={user} />;
}
