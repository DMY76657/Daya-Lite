// CORS for the mobile app and any external REST client.
//
// next.config.ts headers() does NOT apply CORS headers to Next API route
// responses on Netlify — preflights from a different origin (e.g. the mobile
// site at daya-lite-mobile.netlify.app) saw `No 'Access-Control-Allow-Origin'`
// even though preflights themselves were fine. So we attach the headers
// directly to every response via `jsonResponse()` and handle preflight in
// the re-exportable `OPTIONS` below.
//
// We avoid Next middleware here: Netlify's Next 15.5 edge runtime crashes any
// middleware with "a3.snapshot is not a function" 500.
import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function OPTIONS(): Response {
  return new Response(null, {
    status: 204,
    headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' },
  });
}

export function jsonResponse(data: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(data, init);
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}
