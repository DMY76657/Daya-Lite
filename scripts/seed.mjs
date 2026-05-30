// Seed sample data into Neon: 1 admin, 1 regular user, sample meals + today's plan with logs.
// Run with: npm run db:seed
// Loads .env from project root (drizzle.config.ts also reads from here).

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@daya.bg';
const USER_EMAIL = process.env.SEED_USER_EMAIL ?? 'user@daya.bg';
const PASSWORD = process.env.SEED_PASSWORD;

if (!PASSWORD) {
  console.error(
    'SEED_PASSWORD env var is required. Add it to .env (kept out of git).\n' +
    'Pick any value — this is the password the seeded demo accounts will use.',
  );
  process.exit(1);
}

async function upsertUser(email, name, role) {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const [user] = await sql`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (${email}, ${passwordHash}, ${name}, ${role})
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name,
      role = EXCLUDED.role
    RETURNING id, email, role
  `;
  return user;
}

// Starter catalog — kept in sync with apps/web/app/api/auth/register/route.ts
const STARTER_MEALS = [
  { name: 'Овесена каша', description: 'С банан и мед', calories: 320 },
  { name: 'Бъркани яйца', description: 'С пресни подправки', calories: 240 },
  { name: 'Гръцка салата', description: 'С фета и маслини', calories: 280 },
  { name: 'Пилешко с ориз', description: 'Гриловано пилешко филе', calories: 520 },
  { name: 'Леща с ориз', description: 'Класическа постна супа', calories: 380 },
  { name: 'Кисело мляко с плодове', description: null, calories: 180 },
  { name: 'Тиквена супа', description: 'С джинджифил', calories: 210 },
  { name: 'Чай с лимон', description: null, calories: 5 },
];

async function clearUserData(userId) {
  // Wipe meals matching either the legacy 5-name set or the current 8-name
  // starter catalog. Preserves bulk-seeded data from `npm run db:seed:bulk`,
  // which uses auto-numbered names like "Овесена каша #1234".
  const names = Array.from(new Set([
    'Овесена каша', 'Гръцка салата', 'Пилешко с ориз', 'Кисело мляко с плодове', 'Чай с лимон',
    ...STARTER_MEALS.map((m) => m.name),
  ]));
  await sql`
    DELETE FROM meals
    WHERE user_id = ${userId}
      AND name = ANY(${names})
  `;
  const today = new Date().toISOString().slice(0, 10);
  // CASCADE will cleanup meal_logs for this plan
  await sql`DELETE FROM daily_plans WHERE user_id = ${userId} AND plan_date = ${today}`;
}

async function seedStarterMeals(userId) {
  for (const m of STARTER_MEALS) {
    await sql`
      INSERT INTO meals (name, description, calories, user_id)
      VALUES (${m.name}, ${m.description}, ${m.calories}, ${userId})
    `;
  }
  return STARTER_MEALS.length;
}

async function seedMealsAndPlan(userId) {
  const meals = [
    { name: 'Овесена каша', description: 'С банан и мед', calories: 320 },
    { name: 'Гръцка салата', description: 'С фета и маслини', calories: 280 },
    { name: 'Пилешко с ориз', description: 'Гриловано пилешко филе', calories: 520 },
    { name: 'Кисело мляко с плодове', description: null, calories: 180 },
    { name: 'Чай с лимон', description: null, calories: 5 },
  ];

  const mealIds = [];
  for (const m of meals) {
    const [row] = await sql`
      INSERT INTO meals (name, description, calories, user_id)
      VALUES (${m.name}, ${m.description}, ${m.calories}, ${userId})
      RETURNING id
    `;
    mealIds.push(row.id);
  }

  const today = new Date().toISOString().slice(0, 10);
  const [plan] = await sql`
    INSERT INTO daily_plans (user_id, plan_date, notes)
    VALUES (${userId}, ${today}, ${'Примерен план за днес'})
    RETURNING id
  `;

  const logs = [
    { mealId: mealIds[0], time: '08:00', status: 'eaten' },
    { mealId: mealIds[3], time: '10:30', status: 'eaten' },
    { mealId: mealIds[1], time: '13:00', status: 'planned' },
    { mealId: mealIds[2], time: '19:00', status: 'planned' },
    { mealId: mealIds[4], time: '21:30', status: 'planned' },
  ];

  for (const l of logs) {
    const eatenAt = l.status === 'eaten' ? new Date() : null;
    await sql`
      INSERT INTO meal_logs (plan_id, meal_id, scheduled_time, status, eaten_at)
      VALUES (${plan.id}, ${l.mealId}, ${l.time}, ${l.status}, ${eatenAt})
    `;
  }

  return { mealsCreated: meals.length, logsCreated: logs.length };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Did you forget to create .env?');
    process.exit(1);
  }

  console.log('Seeding sample data...\n');

  const admin = await upsertUser(ADMIN_EMAIL, 'Администратор', 'admin');
  await clearUserData(admin.id);
  const adminMealCount = await seedStarterMeals(admin.id);
  console.log(`Admin:  ${admin.email}  (password: ${PASSWORD})`);
  console.log(`        + ${adminMealCount} starter meals`);

  const user = await upsertUser(USER_EMAIL, 'Демо потребител', 'user');
  await clearUserData(user.id);
  const stats = await seedMealsAndPlan(user.id);
  console.log(`User:   ${user.email}  (password: ${PASSWORD})`);
  console.log(`        + ${stats.mealsCreated} sample meals`);
  console.log(`        + today's plan with ${stats.logsCreated} meal logs`);

  console.log('\nDone. Start the web app with: npm run dev:web');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
