// End-to-end smoke test for the Daya Lite API.
// Runs against any base URL (default = production), so the same script
// can verify a local dev server, a preview deploy, or production.
//
// Usage:
//   npm run smoke                       # hits production
//   API_BASE=http://localhost:3000/api npm run smoke
//   SMOKE_EMAIL=... SMOKE_PASSWORD=... npm run smoke

const API_BASE = process.env.API_BASE ?? 'https://daya-lite.netlify.app/api';
const EMAIL = process.env.SMOKE_EMAIL ?? 'user@daya.bg';
const PASSWORD = process.env.SMOKE_PASSWORD ?? process.env.SEED_PASSWORD;

if (!PASSWORD) {
  console.error('SMOKE_PASSWORD (or SEED_PASSWORD) env var is required.');
  process.exit(1);
}

let passed = 0;
let failed = 0;

function check(name, ok, detail = '') {
  if (ok) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

async function run() {
  console.log(`Smoke test against ${API_BASE}\n`);

  // 1. Login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  check('POST /auth/login returns 200', loginRes.status === 200, `got ${loginRes.status}`);
  const loginJson = await loginRes.json().catch(() => ({}));
  const token = loginJson?.data?.token;
  check('login response has data.token', typeof token === 'string' && token.length > 50);
  check('login response has data.user', !!loginJson?.data?.user?.id);

  if (!token) {
    console.log('\nNo token — aborting remaining checks.');
    process.exit(1);
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  // 2. Meals paging
  const mealsRes = await fetch(`${API_BASE}/meals?page=1&pageSize=5`, { headers: authHeaders });
  check('GET /meals?page=1 returns 200', mealsRes.status === 200);
  const mealsJson = await mealsRes.json().catch(() => ({}));
  check('meals response has data array', Array.isArray(mealsJson?.data));
  check('meals response has pagination', !!mealsJson?.pagination?.total);
  check(
    'pagination respects pageSize',
    Array.isArray(mealsJson?.data) && mealsJson.data.length <= 5,
  );

  // 3. CORS headers present on actual response (not just preflight)
  check(
    'CORS Allow-Origin header on /meals response',
    mealsRes.headers.get('access-control-allow-origin') === '*',
  );

  // 4. Plans endpoint (authenticated)
  const plansRes = await fetch(`${API_BASE}/plans`, { headers: authHeaders });
  check('GET /plans returns 200 with token', plansRes.status === 200);

  // 5. Auth guard: no token = 401
  const guarded = await fetch(`${API_BASE}/meals`);
  check('GET /meals without token returns 401', guarded.status === 401);

  // 6. Authz guard: regular user cannot access admin endpoints
  const adminGuard = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders });
  check('GET /admin/users as regular user returns 403', adminGuard.status === 403);

  // 7. Public docs reachable
  const docsRes = await fetch(`${API_BASE}/docs`);
  check('GET /docs returns 200', docsRes.status === 200);

  console.log(`\n${passed} passed, ${failed} failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});
