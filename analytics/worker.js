/**
 * Harbour Drift analytics Worker — write-only event counter for gameplay funnel events.
 *
 * POST /e  body: {"e":"game_over","l":2,"s":350}
 *   e — event name (must be in EVENTS)
 *   l — level 1-4 (optional)
 *   s — score bucket (optional, client pre-rounds to nearest 50)
 *   c — boolean-ish flag (optional, event-specific)
 *
 * Privacy: stores no IP, no user-agent, no cookies, no identifiers of any kind.
 * Only the coarse country code Cloudflare already derived is kept.
 */

const EVENTS = new Set([
  'game_start', 'game_over', 'share_score'
]);

const ORIGIN = 'https://kevincgith.github.io';

const CORS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/e') return new Response('not found', { status: 404 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'POST') return new Response('method not allowed', { status: 405 });

    // sendBeacon can't set Origin-less requests from a browser; reject anything else.
    const origin = request.headers.get('Origin');
    if (origin !== ORIGIN) return new Response('forbidden', { status: 403 });

    let body;
    try { body = await request.json(); } catch { return new Response('bad json', { status: 400, headers: CORS }); }
    if (!body || !EVENTS.has(body.e)) return new Response('bad event', { status: 400, headers: CORS });

    const clampInt = (v, max) => Number.isFinite(+v) ? Math.max(0, Math.min(max, Math.trunc(+v))) : null;
    const ts      = Math.floor(Date.now() / 1000);
    const level   = clampInt(body.l, 9);
    const bucket  = clampInt(body.s, 1000000);
    const flag    = body.c == null ? null : (body.c ? 1 : 0);
    const country = (request.cf && typeof request.cf.country === 'string') ? request.cf.country.slice(0, 2) : null;

    await env.DB.prepare(
      'INSERT INTO events (ts, name, level, score_bucket, flag, country) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
    ).bind(ts, body.e, level, bucket, flag, country).run();

    return new Response(null, { status: 204, headers: CORS });
  }
};
