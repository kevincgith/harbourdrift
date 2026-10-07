# Harbour Drift analytics (Cloudflare free tier)

> **Not wired up yet.** This tier was inherited from the Top Sum fork. `index.html`
> currently has no `ANALYTICS_URL` constant and no `sendBeacon()` calls — both
> tiers below are dormant until someone adds that instrumentation to the game.

Write-only telemetry for understanding traffic and gameplay funnel events.
Once wired up, gameplay would never wait on any of this: the game would fire
fire-and-forget `navigator.sendBeacon()` calls at menu / game-over moments,
and silently no-op when the endpoint is unset, offline, or ad-blocked.

Privacy: no cookies, no IP addresses, no user agents, no identifiers — only
anonymous event counts plus the coarse country code Cloudflare derives anyway.

## Tier 1 — Web Analytics (traffic, referrers, devices)

1. Cloudflare dashboard → **Web Analytics** → *Add a site* → hostname `kevincgith.github.io`.
2. Copy the snippet token and paste it into a `cloudflareinsights.com/beacon.min.js`
   tag added to `index.html`.

That's it — no hosting change; the game stays on GitHub Pages.

## Tier 2 — Worker + D1 (gameplay funnel)

One-time setup from this directory (requires `npm i -g wrangler` and
`wrangler login` with your Cloudflare account):

```sh
wrangler d1 create harbour-drift-analytics        # copy the printed database_id into wrangler.toml
wrangler d1 execute harbour-drift-analytics --remote --file schema.sql
wrangler deploy                             # prints the Worker URL
```

Then add an `ANALYTICS_URL` constant to `index.html` pointing at the Worker
URL + `/e`, e.g. `https://harbour-drift-analytics.<your-subdomain>.workers.dev/e`,
and fire `sendBeacon()` calls at the moments you want tracked.

### Events

`worker.js` currently allowlists three generic events — extend `EVENTS` in
`worker.js` (and this table) as Harbour Drift grows its own share/streak features:

| event          | suggested trigger      | extras                |
|----------------|-------------------------|------------------------|
| `game_start`   | race begins              | level                  |
| `game_over`    | race ends                 | level, score bucket    |
| `share_score`  | score share button tapped |                        |

### Reading the data

```sh
# Race starts by difficulty
wrangler d1 execute harbour-drift-analytics --remote --command "
  SELECT level, COUNT(*) AS n FROM events
  WHERE name='game_start' GROUP BY level ORDER BY n DESC;"

# Where players are
wrangler d1 execute harbour-drift-analytics --remote --command "
  SELECT country, COUNT(*) AS n FROM events
  WHERE name='game_start' GROUP BY country ORDER BY n DESC;"
```

### Free-tier headroom

Workers: 100k requests/day · D1: 100k writes/day, 5M reads/day — orders of
magnitude beyond plausible traffic for this game.
