// TODO: DELETE /api/users/me (password in body) — implement Day 2 (May 18-19)
import { NextResponse } from 'next/server';

export async function DELETE() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
