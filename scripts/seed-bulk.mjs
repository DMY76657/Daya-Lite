// Bulk-seed 10,000 meals for the demo user to validate the scalability
// requirement (paging in /meals UI and /api/meals endpoint).
// Run with: npm run db:seed:bulk

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);
const TARGET_EMAIL = process.env.SEED_EMAIL ?? 'user@daya.bg';
const TARGET_COUNT = 10_000;
const BATCH = 500;

const NAMES = [
  'Овесена каша',
  'Бъркани яйца',
  'Гръцки йогурт',
  'Пилешка салата',
  'Леща с ориз',
  'Печена пъстърва',
  'Тарталета с плодове',
  'Сандвич с пуйка',
  'Боб чорба',
  'Спанак с яйца',
  'Авокадо тост',
  'Тиквена супа',
  'Кафе с мляко',
  'Зелен смути',
  'Овесени барчета',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const [user] = await sql`SELECT id FROM users WHERE email = ${TARGET_EMAIL}`;
  if (!user) {
    console.error(`User ${TARGET_EMAIL} not found. Run npm run db:seed first.`);
    process.exit(1);
  }

  console.log(`Inserting ${TARGET_COUNT} meals for ${TARGET_EMAIL}...`);
  let inserted = 0;
  while (inserted < TARGET_COUNT) {
    const size = Math.min(BATCH, TARGET_COUNT - inserted);
    const rows = Array.from({ length: size }, (_, i) => {
      const idx = inserted + i + 1;
      return {
        name: `${pick(NAMES)} #${idx}`,
        description: `Автоматично добавено за тест ${idx}`,
        calories: 50 + Math.floor(Math.random() * 950),
        user_id: user.id,
      };
    });
    await sql`
      INSERT INTO meals (name, description, calories, user_id)
      SELECT * FROM jsonb_to_recordset(${JSON.stringify(rows)}::jsonb)
        AS x(name text, description text, calories int, user_id uuid)
    `;
    inserted += size;
    if (inserted % 2000 === 0 || inserted === TARGET_COUNT) {
      console.log(`  ${inserted}/${TARGET_COUNT}`);
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
