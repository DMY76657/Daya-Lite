// Shared OPTIONS preflight handler for all API routes. Re-exported via
// `export { OPTIONS } from '@/lib/cors'` from each route.
//
// Why a per-route handler instead of middleware:
// Netlify's Next 15.5 edge runtime crashes any middleware with the cryptic
// "a3.snapshot is not a function" 500. The `headers()` block in next.config
// adds CORS headers to non-OPTIONS responses, but Next doesn't auto-generate
// an OPTIONS handler in App Router — so we provide one explicitly here.
export function OPTIONS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
