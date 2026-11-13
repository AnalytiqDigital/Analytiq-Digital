import { NextResponse } from 'next/server';

/**
 * Convert an unexpected route failure into a JSON 500 response.
 *
 * Without this, a throw inside a GET handler makes Next.js return an empty
 * 500 body — and every admin page calls `res.json()` first, so the user sees
 * only "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
 * with no hint of the real cause. This guarantees the real message (plus a
 * pointer when it smells like missing schema) reaches the UI.
 */
export function toErrorResponse(err: unknown, fallback = 'Something went wrong on the server.'): NextResponse {
  const message = err instanceof Error && err.message ? err.message : fallback;
  // Drizzle wraps the Postgres error: err.message is only "Failed query: ..."
  // plus params, while the real reason (e.g. missing column, NOT NULL
  // violation, RLS denial) lives in err.cause. Surface it so the admin UI
  // shows the actionable message instead of just "check the server console".
  const cause = (err as any)?.cause;
  const causeMessage =
    cause instanceof Error && cause.message
      ? cause.message
      : typeof cause === 'string'
        ? cause
        : cause?.message;
  const fullMessage =
    causeMessage && !message.includes(causeMessage) ? `${message} — ${causeMessage}` : message;
  console.error('Admin API error:', err);
  const missingSchema =
    /relation "[^"]+" does not exist/i.test(fullMessage) ||
    /column "[^"]+" of relation/i.test(fullMessage) ||
    /no such table/i.test(fullMessage);
  const hint = missingSchema
    ? ' The database is missing a table or column — run "npm run db:push" against this same DATABASE_URL, restart the dev server, and try again.'
    : ' Check the server console for the full error.';
  return NextResponse.json({ error: `${fullMessage}${hint}` }, { status: 500 });
}
