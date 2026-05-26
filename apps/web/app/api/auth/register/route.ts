import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users, meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { signToken, sessionCookie } from '@/lib/auth';
import { validateRegister } from '@/lib/validation';

// Starter catalog — every new user gets these 8 meals so the app isn't
// empty on first login. They can edit / delete them like any other meal.
const STARTER_MEALS: ReadonlyArray<{
  name: string;
  description: string | null;
  calories: number | null;
}> = [
  { name: 'Овесена каша', description: 'С банан и мед', calories: 320 },
  { name: 'Бъркани яйца', description: 'С пресни подправки', calories: 240 },
  { name: 'Гръцка салата', description: 'С фета и маслини', calories: 280 },
  { name: 'Пилешко с ориз', description: 'Гриловано пилешко филе', calories: 520 },
  { name: 'Леща с ориз', description: 'Класическа постна супа', calories: 380 },
  { name: 'Кисело мляко с плодове', description: null, calories: 180 },
  { name: 'Тиквена супа', description: 'С джинджифил', calories: 210 },
  { name: 'Чай с лимон', description: null, calories: 5 },
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateRegister(body);

  if (!validation.success) {
    return jsonResponse({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const { email, password, name } = validation.data!;

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return jsonResponse({ error: 'Имейлът вече е зает.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ email, name, passwordHash, role: 'user' })
    .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

  await db
    .insert(meals)
    .values(STARTER_MEALS.map((m) => ({ ...m, userId: user.id })));

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });

  // token is included in body for mobile clients (Bearer auth); web ignores it (uses cookie)
  const response = jsonResponse({ data: { user, token } }, { status: 201 });
  response.cookies.set(sessionCookie(token));
  return response;
}

export { OPTIONS } from '@/lib/cors';
import { jsonResponse } from '@/lib/cors';
