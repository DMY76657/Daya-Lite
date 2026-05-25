// GET /api/docs — human-readable HTML API reference (for the Expo mobile app and curious clients)

interface Endpoint {
  method: string;
  path: string;
  auth: 'public' | 'user' | 'admin';
  summary: string;
  body?: string;
  returns: string;
}

const ENDPOINTS: Endpoint[] = [
  // Auth
  { method: 'POST', path: '/api/auth/register', auth: 'public', summary: 'Create an account',
    body: '{ email, password, name }', returns: '{ data: { user, token } }' },
  { method: 'POST', path: '/api/auth/login', auth: 'public', summary: 'Sign in',
    body: '{ email, password }', returns: '{ data: { user, token } }' },
  { method: 'POST', path: '/api/auth/logout', auth: 'public', summary: 'Clear session cookie', returns: '{ data: { ok: true } }' },

  // Meals
  { method: 'GET', path: '/api/meals', auth: 'user', summary: "List current user's meals", returns: '{ data: Meal[] }' },
  { method: 'POST', path: '/api/meals', auth: 'user', summary: 'Create a meal',
    body: '{ name, description?, calories? }', returns: '{ data: Meal }' },
  { method: 'GET', path: '/api/meals/:id', auth: 'user', summary: 'Get one meal', returns: '{ data: Meal }' },
  { method: 'PUT', path: '/api/meals/:id', auth: 'user', summary: 'Update meal',
    body: '{ name, description?, calories? }', returns: '{ data: Meal }' },
  { method: 'DELETE', path: '/api/meals/:id', auth: 'user', summary: 'Delete meal', returns: '{ data: { id } }' },

  // Plans
  { method: 'GET', path: '/api/plans', auth: 'user', summary: "List user's plans", returns: '{ data: DailyPlan[] }' },
  { method: 'GET', path: '/api/plans/:date', auth: 'user', summary: 'Get plan for date with logs+meals joined',
    returns: '{ data: DailyPlan & { logs: (MealLog & { meal: Meal })[] } | null }' },
  { method: 'POST', path: '/api/plans', auth: 'user', summary: 'Create plan for a date',
    body: '{ planDate: "YYYY-MM-DD", notes? }', returns: '{ data: DailyPlan }' },
  { method: 'PUT', path: '/api/plans/:id', auth: 'user', summary: 'Update plan notes',
    body: '{ notes? }', returns: '{ data: DailyPlan }' },

  // Logs
  { method: 'POST', path: '/api/logs', auth: 'user', summary: 'Add meal to a plan',
    body: '{ planId, mealId, scheduledTime: "HH:MM", status: "planned"|"eaten"|"skipped" }',
    returns: '{ data: MealLog }' },
  { method: 'PUT', path: '/api/logs/:id', auth: 'user', summary: 'Update log time/status',
    body: '{ scheduledTime?, status? }', returns: '{ data: MealLog }' },
  { method: 'PATCH', path: '/api/logs/:id/eat', auth: 'user', summary: 'Mark log as eaten (sets eaten_at=now)',
    returns: '{ data: MealLog }' },
  { method: 'DELETE', path: '/api/logs/:id', auth: 'user', summary: 'Remove log from plan', returns: '{ data: { id } }' },

  // Admin
  { method: 'GET', path: '/api/admin/users', auth: 'admin', summary: 'List all users', returns: '{ data: User[] }' },
  { method: 'GET', path: '/api/admin/users/:id', auth: 'admin', summary: 'Get user details', returns: '{ data: User }' },
  { method: 'DELETE', path: '/api/admin/users/:id', auth: 'admin', summary: 'Delete user (cascades)', returns: '{ data: { id } }' },

  // Self
  { method: 'DELETE', path: '/api/users/me', auth: 'user', summary: 'Self-delete account with password confirmation',
    body: '{ password }', returns: '{ data: { ok: true } }' },
];

function badge(auth: Endpoint['auth']): string {
  const colors = {
    public: '#10b981',
    user: '#3b82f6',
    admin: '#ef4444',
  };
  return `<span style="background:${colors[auth]};color:white;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500">${auth}</span>`;
}

function methodColor(method: string): string {
  const map: Record<string, string> = {
    GET: '#10b981',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    PATCH: '#8b5cf6',
    DELETE: '#ef4444',
  };
  return map[method] ?? '#64748b';
}

function escape(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);
}

function renderHtml(): string {
  const rows = ENDPOINTS.map(
    (e) => `
    <div class="endpoint">
      <div class="head">
        <span class="method" style="background:${methodColor(e.method)}">${e.method}</span>
        <code class="path">${e.path}</code>
        ${badge(e.auth)}
      </div>
      <div class="summary">${escape(e.summary)}</div>
      ${e.body ? `<div class="row"><span class="label">Body:</span><code>${escape(e.body)}</code></div>` : ''}
      <div class="row"><span class="label">Returns:</span><code>${escape(e.returns)}</code></div>
    </div>`,
  ).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Daya Lite API</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; background: #f8fafc; }
    h1 { color: #047857; margin-bottom: 0.25rem; }
    h2 { color: #334155; margin-top: 2rem; }
    .intro { background: white; padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; }
    .intro code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.875rem; }
    .endpoint { background: white; padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 0.75rem; border: 1px solid #e2e8f0; }
    .head { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .method { color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .path { font-family: ui-monospace, "SF Mono", monospace; font-size: 14px; color: #0f172a; }
    .summary { color: #475569; margin-top: 0.5rem; font-size: 0.9rem; }
    .row { margin-top: 0.5rem; font-size: 0.85rem; }
    .row code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #475569; }
    .label { color: #64748b; font-weight: 500; margin-right: 0.5rem; }
  </style>
</head>
<body>
  <h1>Daya Lite API</h1>
  <p style="color:#64748b">RESTful API for the Daya Lite meal planner</p>

  <div class="intro">
    <p><strong>Authentication:</strong></p>
    <ul>
      <li>Web clients: <code>httpOnly</code> cookie named <code>daya_token</code> (set automatically on login/register).</li>
      <li>Mobile clients: <code>Authorization: Bearer &lt;token&gt;</code> header. The token is returned in the response body of <code>/api/auth/login</code> and <code>/api/auth/register</code>.</li>
    </ul>
    <p><strong>Response shape:</strong> success → <code>{ "data": ... }</code>, error → <code>{ "error": "..." }</code> (Bulgarian).</p>
  </div>

  <h2>Endpoints</h2>
  ${rows}
</body>
</html>`;
}

export async function GET() {
  return new Response(renderHtml(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export { OPTIONS } from '@/lib/cors';
