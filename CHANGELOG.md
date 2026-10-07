# Changelog

> **Note:** this project was forked from [Top Sum](https://github.com/mli3w/top-sum) and rebuilt into **Harbour Drift · Hong Kong**, a different game. Everything below this note is inherited history from the original Top Sum project (a Marina Bay flying game) and is kept for reference — none of those features (planes, ZOOOM boost, National Day mode, URL challenges, etc.) exist in Formula X. New entries for Formula X will be added above this line going forward.

All notable changes to **Top Sum** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project loosely adheres to semantic versioning.

---

## [v20.1] — 2026-07-23

**Release hardening for the National Day window.** No gameplay changes — this patch makes the NDP look self-reverting, removes the game's only CDN dependency, and puts the README on a diet.

### Changed
- **NDP season window replaces perpetual NDP** — `festiveActive()`'s default is now a date window (**Jun 25 – Aug 31**, opening in step with the countdown chip's 45-day run-up) instead of always-on. The game self-reverts to its everyday look on Sep 1 with no redeploy, and re-enters the season automatically every year; Aug 9 itself always counts. The `?ndp=1` / `?ndp=0` overrides and the persistent 🎆 toggle keep exactly their v20 semantics.
- **Three.js vendored locally** (`vendor/three.r128.min.js`, MIT, identical to npm `three@0.128.0`) — the game no longer loads anything from cdnjs, so a CDN outage or a school/corporate network filter can't black-screen it on launch weekend. The existing load-failure fallback message stays as a safety net.
- **README demo GIF cut 22 MB → 4.9 MB** (460 px / 13 fps, trimmed to the first ~11 s) so the landing page no longer forces a 22 MB download on every visitor — while keeping playback near the original's 14 fps so the flight reads smoothly, not choppy.

### Fixed
- The Aug-9 "🇸🇬 HAPPY NATIONAL DAY!" title toast no longer fires when the player has explicitly forced festive off with `?ndp=0` — the guard treated "param absent" and "param = 0" the same.

### Removed
- Two unreferenced screengrab PNGs (~1.5 MB) superseded by the JPG share card.

### Verified
- Headless functional sweep, zero page errors throughout: all four difficulties fly 12 s and pause/resume cleanly; a valid `?c=` challenge link shows the banner and starts at the challenger's difficulty while three malformed/out-of-range variants are rejected silently; the game boots and plays with `localStorage` access throwing (Safari private-mode behavior); on a 360×800 touch viewport all difficulty buttons sit above the fold and the d-pad renders; faked-clock checks confirm the season default reverts on Sep 1 2026, greets SG61 on Aug 9, and re-arms for SG62 in June 2027.

## [v20] — 2026-07-03

**The NDP release build.** National Day mode becomes the default look, the bay gets a night, reflections-on-a-budget, the missing river bridges and signature towers land, and the whole thing runs on fewer draw calls than before the pass started.

### NDP vs normal — what's gated where

| Feature | Gate |
|---|---|
| GPU water waves, merged shophouse geometry, ring-buffer trails | Always (pure perf) |
| SkyPark pool + parasols, river bridges, Lau Pa Sat, Marina One | Always (world accuracy) |
| Night Flight | Time picker, unlocks at 700 pts |
| Light-smear bay reflections | Sunset + Night |
| Water firework glow | Whenever fireworks burst |
| HDB flags, bunting, Float crowd, spectator boats, drone show, Red Lions, red/white takeover | Festive — **now default ON** |
| Escape hatches | 🎆 toggle off (persists) · `?ndp=0` (session) |

### Added
- **Perpetual National Day mode** — `festiveActive()` now defaults ON instead of Aug-9-only. The 🎆 toggle still opts out persistently; `?ndp=0` joins `?ndp=1` as a session-only override for A/B comparison or a fast cut if the red/white look needs to come back down.
- **Night Flight** — a third time-of-day preset: near-black blue sky, cool moonlight (the sun sprite doubles as the moon), city-carried lighting (windows at full glow, garland, supertrees, Helix, the SkyPark pool), bright-gold answer gates. Unlocks at 700 points through the existing ladder with celebration + preview; every sunset-only ambient system (fireworks + streak finales, Spectra, beacon ceiling, traffic light-streams) widened to cover it.
- **Fake skyline reflections** — three additive light-smear strips just off the CBD, MBS and Esplanade shores at sunset/night, with per-strip shimmer. One shared 128² canvas, three draw calls.
- **The bay answers the sky** — while fireworks burst, the water emissive lerps toward the burst color from per-mode bases, so the NDP finale flushes the whole reservoir red.
- **Singapore River bridges** — Cavenagh (pedestrian suspension posts), Anderson (white steel arches) and the Esplanade Bridge + Jubilee walk, all centred on the bumboat cruise line so the boat threads under them like the real river cruise.
- **Lau Pa Sat** — the octagonal Victorian market hall + corner clock tower low between the CBD canyon rows (apex ~19 vs the drift-envelope floor ~40).
- **Marina One** — four bronze-green towers around a green-heart canopy at Marina South, ~55 off the closing path leg (Promontory searchlight lawn kept clear), standard colliders.
- **MBS SkyPark deck pass** — the infinity pool joins the dusk dimmer (a glowing cyan strip at night, right where players skim), plus a white infinity-edge rim and cabana row.
- **NDP set dressing** (one festive-gated group, stripped live by the toggle): wall flags draped down all five HDB estates, red/white bunting along the Boat Quay and Clarke Quay shophouse fronts, a ~260-speck crowd terraced up the Float grandstand arcs, and eight spectator boats anchored off the platform.
- **`?debug=1` dev overlay** — live draw calls / triangles / geometries / textures / fps, plus `window._scene` / `_camera` hooks for headless QA probes.

### Changed
- **Water is GPU-displaced** — the two CPU wave terms moved into the Phong vertex shader via `onBeforeCompile` (plus a now-free high-frequency ripple), killing the ~1.7k-vertex per-frame JS loop and full buffer re-upload; mesh density raised 40→96 desktop / 22→40 mobile.
- **Shophouse rows merged** — 49 houses were 98 meshes with ~49 one-off materials; now 10 meshes sharing 2 materials (vertex-colored bodies) via a hand-rolled indexed-geometry merge.
- **Contrail buffers** — flypast and Red Lions smoke trails shift via `copyWithin` instead of element loops.

### Measured
- Title-orbit draw calls: **586 before the pass → 568 with every new feature on screen** (521 with festive off). The merge paid for all the additions.

### Verified
- Headless sweep across day/sunset/night × festive on/off: zero page errors; smears visible at sunset/night; festive default on, `?ndp=0` strips the dressing live; Red Lions, gameplay, and challenge flows intact.

---

## [v19] — 2026-06-13

**Tiny mode grows up as a learning tool, and every wrong gate now teaches.**

A pass focused on the youngest learners and on making mistakes instructive rather than just costly.

### Added
- **Pedagogical distractors (all levels)** — wrong answer gates are no longer random near-misses. Each now mirrors a real childhood mistake: miscounted by one, added-instead-of-subtracted (or vice-versa), wrote both digits (`2+3 → 23`), or one skip-count too few/many on times tables (`8×7 → 48 / 63`). Rejecting a wrong answer is now itself a tiny lesson. Falls back to near-miss fillers only when a fact yields too few natural candidates.
- **Tiny is a finishable mission** — instead of an endless run, Tiny is now a short mission: reach **10 correct** to win the flight with a firework celebration and a "🎉 MISSION COMPLETE!" results screen. Gives the youngest a clear "you did it" finish and a healthy stopping point.
- **Concrete counting aid (Tiny only)** — two groups of countable chicks (🐥🐥 + 🐥) render under the equation so a pre-reader can solve by counting, not by recall (Singapore-math concrete → pictorial → abstract).
- **Learning beat on every miss (all levels)** — a wrong answer now lights up the gate that *was* correct in green, turning the mistake into the most teachable second in the game.
- **Adaptive review (solo play)** — a missed fact is quietly re-queued to resurface a few questions later; getting it right on the resurface clears it. Flight-scoped and **disabled in challenge mode**, so head-to-head links stay perfectly deterministic.
- **Tiny readout, decluttered** — Tiny drops the Lives row and Flow badge for a plain **Streak** count and the **Top Score**, the clearest, lowest-pressure HUD for little ones.

### Changed
- **Tiny is forgiving and crash-proof** — Tiny has **no lives**: a wrong answer just counts it out and flies on, and flying into a building is a harmless wobble back to center. Nothing ends the flight but reaching the mission goal. (Other levels are unchanged.)
- **Tiny holds a flat pace** — Flow and Speed-Mode multipliers no longer speed Tiny up. A streak's reward stays cosmetic (planes, cheers, mission progress) and never shortens the time a young child has to think.

### Verified
- Challenge determinism re-confirmed: identical seeds produce identical question *and* option sequences across all four levels; every question always renders exactly three unique gates including the correct answer.

---

## [v18] — 2026-06-11

**Coins charge the ZOOOM bar, and no two laps fly the same.**

### Added
- **Sky-star coins charge ZOOOM** — each collected star now adds a quarter of a correct answer's charge to the ZOOOM bar (on top of its +2 × flow score), so a clean 6–8 star run between gates is worth roughly 1.5–2 answers of boost.
- **Per-lap path variation** — every lap the whole route shifts slightly **left, right (±20 m), up (+14 m) or down (−12 m)**, so consecutive loops never feel identical. The direction is picked per lap (deterministic — challenge replays see the same sequence) and never repeats the previous lap's. The pink guide tube rebuilds each lap to show the current shifted route.

### Safety
- The shift **fades smoothly to zero through the three precision sections** — the MBS skypark skim, the Flyer pass, and the CBD canyon + MBFC run — so their verified close-pass geometry is untouched, and the direction re-roll happens mid-skim where the shift is zero (nothing jumps). Gates and stars that spawn across the re-roll point are placed with the next lap's direction so the world always agrees with itself.
- Verified offline against the full collider set with real three@0.128, running the actual game code: for all four directions the shifted centerline and the gate reach (±23.5) contact nothing, and the drift-envelope contact set is unchanged from v17.

---

## [v17] — 2026-06-11

**The CBD becomes a flythrough canyon.** The west-shore run of the flight path used to skirt *past* the financial district up high; now it **dives to Y≈56 and threads a tower-lined avenue**, skyscrapers towering on both sides — a genuine canyon run through downtown.

### Added
- **CBD canyon (Raffles Place)** — rebuilt as two rows of 120–145-unit (240–290 m) towers flanking the path's west run, two of them masted. The path descends into it (new P14–P16) and threads between the rows.
- **MBFC financial district** — grown from a trio into a full sub-district of nine towers at the bay's SW corner, threaded low on the way out (new P17). New urban ground plates under both districts.

### Changed
- **Flight path re-tuned** — P14–P16 now dive into the CBD canyon (floor Y≈56) and P17 passes low through MBFC before the climb back onto the opening vista. Lap ≈ 2065 m, max pitch ≈ 22° (cadence envelope unchanged).
- **Placement method** — canyon towers are positioned ~44 units off the *actual curved path normal* (not a straight line), so clearance stays uniform as the route bows: a centred pass and the ±16 answer gates clear with margin, while a **hard full ±28 drift can still clip a tower** — close but safe, with the thrill intact.

### Verified
- Offline drift-envelope sweep (xMax 28 / yMax 16): **zero centerline contacts**, all canyon/MBFC towers on land (point-in-polygon), envelope contacts only at the deliberate set (MBS skypark + Flyer from above, plus the CBD/MBFC rows at full lateral drift).

---

## [v16] — 2026-06-11

**Marina Bay open world rebuilt from the real map.** The old world was a mirror image of Singapore. Root cause: `buildLand`'s `ExtrudeGeometry` + `rotateX(-π/2)` maps shape-y to world **−z**, so every coastline polygon rendered flipped east–west while comments assumed otherwise. v16 fixes the transform at the source and rebuilds the whole world from real lat/lon at 1:2 scale with true compass coordinates (north = −z, east = +x), so what you see in flight finally matches Google Maps.

### Changed
- **No more islands floating in the sea** — the world is one continuous urban landmass running past the fog horizon, with the *water* carved in: the Marina reservoir (bay + **Singapore River** + Helix mouth + **Kallang basin**, sealed by the **Marina Barrage** dam) is a hole in the land, and the open sea is cut along the real south/east coastline. **Bay East Garden** is the green peninsula between the basin and the sea.
- **Every landmark anchored to its real position** and verified on land by an offline point-in-polygon sweep — no more towers standing in the water. CBD behind Collyer Quay on the west shore; civic district + Esplanade + the Float + Suntec + the Flyer along the north; ArtScience on its bay-jutting promontory, MBS's slab running N–S with the cantilever prow toward ArtScience, and Gardens by the Bay down the east; the Merlion at the river-mouth corner with the Fullerton just SW; MBFC at the SW corner. A bumboat now cruises the river past Boat Quay.
- **The city reads as a city**: district ground plates and asphalt roads under the built-up quarters, the **Benjamin Sheares/ECP viaduct** striding the basin east of the Flyer (with its own headlight stream), **Boat Quay and Clarke Quay shophouse rows** in pastel, the **Padang** with colonial civic blocks and a Victoria clock tower, the **Gardens domes** (Flower Dome + Cloud Forest), **Suntec's five towers arced around a gold Fountain of Wealth**, the **Marina Barrage** visitor centre with its grass roof, and background mid-rises so the skyline doesn't just stop.
- **Garden city pass** — every tree in the world now comes from a two-draw-call instanced planter (~400 trees): avenue rows along every road, park clusters (Esplanade Park, the Padang fringe, Gardens by the Bay, Kallang riverside), shore strips (Bay East Garden, East Coast Park, the strait-facing shore) and a land-checked city-wide scatter — raintree greens with pink trumpet-tree and golden flame accents.
- **A skyline ring of recognizable landmarks at distance**: the **National Stadium** dome at Kallang (its real spot at the basin's end), the **Swissôtel Stamford** twin slab behind the Padang, the **Sultan Mosque**'s gold dome in Kampong Glam, **Pinnacle@Duxton**'s seven skybridge-linked towers above a **Chinatown shophouse field** with the **Buddha Tooth Relic Temple**, **Raffles Hotel**, a forested **Fort Canning hill**, an **Orchard-road tower cluster** on the NW horizon, **Tanjong Pagar port** gantry cranes and container stacks on the strait coast, **cargo ships at anchor** offshore (the eternal Singapore horizon), and three more **HDB heartland estates** ringing the core.
- **Flight path redesigned** as a counterclockwise bay tour in real compass order: south-shore vista → a long S→N **skypark skim down the full MBS slab** → over the Helix mouth → Flyer pass → Suntec turn → the Float and Esplanade → river mouth → CBD east-face run → MBFC corner. Offline drift-envelope sweep: zero centerline contacts; envelope contacts only at the four deliberately-reachable structures (MBS skypark, Flyer, two CBD towers). Lap ≈ 2050 m, max pitch ≈ 22°; a headless autoplay run over multiple laps confirms zero building hits.
- **Boats, ambient traffic, the shoreline garland, fireworks sites and the Spectra lasers** all re-anchored to the new geography (Spectra had been left behind at a pre-v15.1 MBS position).

### Fixed
- **The land-shape mirror** described above — the actual root cause of every "the map is flipped" symptom since the skyline was first laid out.
- **The flag Chinook flew backwards** — its heading was exactly π off the orbit velocity, so it orbited tail-first with the flag streaming ahead of it.
- **The Singapore flag was mirrored** — the crescent and stars were drawn at the fly end of the flag; they now sit at the hoist, where the tow line attaches.

---

## [v15.1] — 2026-06-10

**Geography remap.** Marina Bay now matches the real map: the Helix Bridge actually bridges something, NS Square and the Merlion sit on their proper shores, the Bayfront trio moved to the true south-east, and two new icons join the skyline.

### Added
- **Fullerton Hotel** — a low colonial palazzo beside the Merlion (real adjacency), with a colonnade facade that glows warmly at dusk.
- **MBFC towers** — a trio of dark-glass financial-centre towers on the Marina South west strip, with a blinking beacon on the tallest.
- **Marina East promenade + garland extension** — the shoreline light garland now crosses the Helix deck and runs up the east shore past NS Square, with matching walking paths.

### Changed
- **Helix Bridge** re-anchored over the real east channel — both deck ends land on the Marina South / Marina East banks, and the ambient traffic route crosses it. The central bay is now collider-free for boats.
- **NS Square** anchored on the Marina East shore: grandstand on land, circular platform jutting west over the water — the real Float anchoring. Festive fireworks anchor moved with it.
- **Merlion** moved to the civic water's edge, rotated to spout **east into the bay**.
- **Bayfront accuracy** — MBS, the ArtScience Museum (disk rim now touching the shoreline) and the Supertree Grove (rotated so the grove elongates north–south, like the real Gardens) shifted to the true south-east Bayfront.
- **Flight path retuned** around the moved MBS: the skypark close-pass is geometrically identical relative to the building; the descent leg now passes east of the towers. Re-verified offline — same answer-cadence envelope as v15 (9–11 s average gaps, ≥2.9 s sightlines at top speed) and the same three deliberately-reachable structures in the drift-envelope sweep, with zero centerline contacts. Lap 2587 m → 2697 m.

---

## [v15] — 2026-06-10

**Singapore Flavor Pack + a Cities: Skylines world pass.** Singlish cheers, a full National Day mode, an NS Square landmark, a skyline rebuilt on shared lit-facade materials, a Gold Cockpit UI refresh, pacing v3, and privacy-first analytics that ship switched off.

### Added
- **Singlish streak cheers** — the streak headline ladder now speaks Singlish (*SHIOK! · STEADY LAH! · POWER LAH! · WAH, SO ZAI! · HUAT AH!*) with `FLOW ×N · PERFECT RUN` in the sub-line. 🇸🇬 title-screen toggle, default on, persists (`topsum_singlish`).
- **National Day mode** — auto-activates every Aug 9, pinnable via the 🎆 settings pill (persists, `topsum_festive`), or forceable any day with `?ndp=1` (session-only, never written to storage). Red/white UI accent takeover, red/white facade lights and beacons, day-round fireworks, festive flypast cadence.
- **Streak-10 RSAF salute** — hit streak 10 (and 20, 30…) and a low formation pass roars over within seconds, in day and sunset. Ambient flypast scheduling resumes afterwards.
- **Rotating Singapore Flyer** — the wheel actually turns now (~100 s/revolution), capsules stay level, legs and base static.
- **Festive fanfare** — an original ascending sting (deliberately *not* the anthem), once per session on first flight start.
- **NS Square landmark** on the NE shore between the Esplanade and the Flyer — the new fireworks anchor site.
- **Shoreline light garland** — a glowing promenade rim at dusk and on festive days.
- **Festive Chinook escorts** — two escort helis flank the flag Chinook on National Day, sharing the parent's materials.
- **Lit window facades + rooftop props + aircraft-warning beacons + ambient traffic** — the Cities: Skylines world pass. Windows glow from shared canvas-texture sheets, roofs get a prop kit and setback crowns, tall towers blink, and 200-sample car streams read as dark specks by day and light rivers at dusk.
- **Sky Star pickups + gate approach beacon/chime** — something to chase during breathers, and a clear audio-visual cue when the next gate cluster is coming.
- **Privacy-first Cloudflare analytics** for the share/challenge funnel (`analytics/` Worker + D1, plus a commented-out Web Analytics tag). Fire-and-forget `sendBeacon` at menu/end-of-flight moments only; no IP, no user-agent, no identifiers, score bucketed to the nearest 50. **Ships switched off** — every call no-ops until `ANALYTICS_URL` is configured. See [`analytics/README.md`](analytics/README.md).
- **Gold Cockpit UI refresh** — design tokens, segmented pill controls (no native radios/checkboxes), above-the-fold title screen on 360×800, trimmed HUD (Lives + Score, Flow badge from streak 3+), card-style modals.

### Changed
- **Gate spawning is now time-based and sightline-aware**, and the flight path was reshaped into 18 points with widened turnarounds — a consistent ~9–12 s answer cadence at all speed tiers, with deliberate breathers.
- **Formation flypasts**: festive cadence tightened (~14–24 s) with a sunset allowance, alternating red/white festive trails, and a red/white fireworks palette bias on National Day.
- **Title screen redesigned** around the new token system.
- **Fog depth tuned per time-of-day** — clear tropical day vs hazy amber sunset.
- **Skyline rebuilt on shared materials** — a handful of shared facade sheets instead of per-building materials; large draw-call reduction.

### Fixed
- **Day-mode ZOOOM fireworks** were force-launched by `update()` and then reset to idle by `tickFireworks()` on the very next frame, so they never rendered. An active ZOOOM now keeps its bursts alive in plain day mode.

### Conscious decision: reduced motion
In-world WebGL ambient motion (the rotating Flyer, flypasts, fireworks) is **not** suppressed under `prefers-reduced-motion` — consistent with the ambient world motion (water, boats, Chinook) the game has never suppressed. UI-layer animation continues to respect the preference; the Singlish cheers ride the existing `#feedback` opacity transition with no new keyframes.

---

## [v14] — 2026-05-10

**URL Challenge** — async multiplayer without a backend. Share a link, a friend plays the exact same questions, head-to-head at the end. Zero accounts, zero servers, zero data leaves either device.

### Added
- **URL Challenge mode.** After any flight, hit **🎯 Share Challenge** to generate a shareable link like `https://mli3w.github.io/top-sum/?c=<seed>-<level>-<score>` (compact base-36 encoding, ~12 chars — fits cleanly in iMessage previews). Recipient opens the URL, taps **Take the challenge** from the title-screen banner, and plays the *exact same questions in the exact same order*. At game over, both scores appear side-by-side with a verdict.
- **Seedable question RNG.** Question generation now routes through a swappable `questionRng` — `Math.random` for normal play, a Mulberry32 PRNG seeded from the URL in Challenge mode. Both players see identical sequences.
- **Title-screen challenge banner.** Pulsing magenta panel when an incoming challenge is detected. Two buttons: Take Challenge (enters challenge mode at the challenger's difficulty) or Skip (strips `?c=` from the URL so refresh doesn't re-surface it).
- **Head-to-head game-over comparison.** When the flight was a challenge, a `vs` block appears above the score lines: *You / Challenger / verdict* (🏆 won, ❌ beaten, 🤝 tied).
- **Share Challenge button on every flight.** Even normal-mode runs can be sent as a challenge — encodes whatever seed that flight was running on.

### Changed
- **Fly Again preserves challenge mode.** If the just-finished flight was a challenge, "Fly Again" replays the *same* questions for a rematch. Without this, a lost challenge would silently become a fresh-seed flight, breaking the natural "I was so close, let me try again" loop.

### How it works (no servers)
The entire "match state" is encoded in the URL itself. `seed.toString(36) + '-' + level + '-' + score.toString(36)`. The recipient's game decodes the URL on load, locks the difficulty and seed, and the Mulberry32 PRNG deterministically reproduces the question sequence. The verdict at the end is local — both players' devices independently know the result without ever communicating with a server.

---

## [v13.2] — 2026-05-10

Internal refactor patch — no new gameplay features. Stabilises three patterns from a senior-review pass: a recurring modal click bug, per-question allocation churn, and synchronous localStorage writes on the render loop.

### Changed
- **Modal pattern consolidated.** Replaced two ad-hoc `pointer-events: auto` rules on `#pause-overlay` and `#unlock-celebration` with a single shared selector: `#hud [role="dialog"] { pointer-events: auto }`. Both overlays gained `role="dialog"` + `aria-modal="true"` + `aria-label` — semantic + accessibility win. Future modals inside `#hud` inherit the click-fix automatically (stops the bug pattern at its source).
- **Gate pool.** Pre-build 3 reusable gate shells at startup instead of allocating fresh `Three.Mesh` + materials + a 256×256 canvas + GPU texture upload per question. `setupGate()` mutates the pool's materials and canvas in place; `clearGates()` hides instead of removing from the scene. Saves ~10 allocations + 1 GPU texture upload per question.
- **`persistAsync` helper.** Wraps `Settings.save()` (5 writes per toggle) and `maybeUpdateBest()`'s best-score write (fires after every correct answer on a best run) in `requestIdleCallback` with a `setTimeout` fallback for older Safari. Pushes localStorage hitches off the render loop.

### Verified clean
- **Frame-rate independence audit** — no animations use raw frame counts. Every per-frame mutation routes through `dt`, `rawDt`, or accumulated `time`. 120 Hz displays should match 60 Hz pacing exactly.

---

## [v13.1] — 2026-05-10

Polish patch on top of v13. Speed Mode gains a Faster tier, wingmate contrails finally look like contrails, and the v13 regression that hid most in-game icons is fixed.

### Added
- **Desktop in-game hint** now surfaces `Z: ZOOOM` so the shortcut is discoverable during play.

### Changed
- **Speed Mode** upgraded from a 2-state toggle to a 3-state cycle:
  - Off (1.0×)
  - ⚡ Fast (1.5× — same as the previous Speed Mode)
  - ⚡⚡ Faster (1.85× — new)
  - Caps at 1.85× so 3-digit hard math stays readable when stacked with Flow ×4 and ZOOOM.
  - Title-screen checkbox replaced with a radio picker mirroring the time-of-day pattern.
  - In-game ⚡ icon cycles through tiers — emoji switches to ⚡⚡ at Faster with a brighter glow and a tighter 0.95s pulse.
  - `S` key cycles Off → Fast → Faster → Off.
  - Backward compat: old `topsum_speedmode='1'` saves map to Fast.
- **Wingmate ZOOOM contrails** replaced with a triangle-strip ribbon mesh — same custom shader and 25 Hz sample rate as the player's plane trail. Was a Points cloud that read as floating squares.
- **Mobile icon column** gap tightened 10 px → 8 px to fit six icons cleanly on smaller phones.

### Fixed
- **In-game icon column on desktop:** a stray CSS rule shipped with v13 hid every icon except Speed Mode. Removed — all six icons render again on both desktop and touch.

---

## [v13] — 2026-05-10

The biggest update since launch. New ZOOOM cinematic boost, Speed Mode for fast players, redesigned title logo, sunset bumps, and an RSAF flypast over Marina Bay.

### Added
- **ZOOOM cinematic boost** — pill-shaped bar fills as you answer correctly (5/7/10 streak by difficulty). Once full, tap or press `Z` to fire a 3/4-of-circuit cinematic lap:
  - Big italic "ZOOOM" word flies across the screen at activation
  - Two F-16 escort jets fade in from the rear, lock onto your flanks, then peel off climbing-and-outward in the final 15% of the lap
  - Each wingmate emits a glowing additive-blend vapor trail (80-sample point cloud)
  - Camera FOV widens from 72° to 92° for a warp-tunnel feel
  - Spinning radial speed-streaks overlay + bright edge vignette
  - Fireworks force-fired across the bay every 0.28–0.50s during the lap (bypasses sunset gating)
  - 3-note rising sting (C5/E5/B5) + low-frequency sawtooth engine swell at activation
  - G-force camera shake on activation
  - Tap mid-question = "ZOOOM ARMED" — auto-fires after the answer settles, never rug-pulls a question
  - Math layer suspended for the lap; base speed × 2.2; gates removed
- **Speed Mode** (50% faster base × flow speed) — title-screen checkbox + in-game `⚡` icon (visible on touch and desktop) + `S` keyboard shortcut. Persists to localStorage. Stacks with Flow multiplier and ZOOOM.
- **NDP-style RSAF fighter flypast** in day mode — 5 jets in arrow formation streak across the bay every ~35–65s with fading white contrails.
- **Star insignia (★)** above the title logo with twinkle + gentle vertical float.
- **Cinematic warm radial bloom** backdrop behind the title logo.
- **Title intro sequence** (~1.6s, one-shot): wings sweep outward, TOP SUM settles, star drops with a subtle overshoot, subtitle rises last.
- **Ambient title loops**: breathing gold pulse on the type; star twinkle + float.
- **Sunset Mode unlock celebration** at 1000 pts now includes a full-screen sun-flare bloom, slow-rotating golden sun-rays behind the card, a pulsing halo ring behind the 🌅 icon, and ~46 falling golden sparkle particles in two bursts.
- **`body.sunset-pending` indicator** — glows the in-game ☀ time icon and the title-screen 🌅 Sunset radio until the player engages sunset for the first time, then auto-clears.
- **Title-screen keyboard hint** now surfaces all six shortcuts (C / M / T / S / Z / ESC).
- `prefers-reduced-motion` disables every new title and ZOOOM animation.
- `README.md`, `LICENSE` (MIT), and this `CHANGELOG.md` added to the repo.

### Changed
- **Title logo redesigned** — single centered swept-forward delta wing pair in chrome forming an inverse triangle that frames the type; V tip drops near the · in the subtitle. TOP SUM now side-by-side same-sized italic gold metallic (was stacked, with SUM in blue). Brighter gradient and warm amber halo replacing the prior dark vignette.
- **Sunset firework palette** doubled — added green / cyan / orange / purple / lime (10 colours total).
- **Sunset firework cadence** tightened from 6–8s to 4–5.5s for a slightly denser sky.
- **Subtitle** letter-spacing tightened ~14%, colour brightened, opacity 0.95 → 1.
- **Open Graph + Twitter card** meta tags now use absolute URLs anchored to `https://mli3w.github.io/top-sum/` with a working `og:image` (234KB PNG — was a 15MB animated GIF that exceeded the 5MB cap on LinkedIn / Slack / WhatsApp, causing share previews to drop to plain links).
- `shareScore()` always shares the canonical play URL — never a local `file://` path or query-string variant.

### Fixed
- **Sunset Mode unlock celebration** "Try it now / Maybe later" buttons were unclickable on desktop. Same root cause as the v12 pause overlay fix — overlay nested inside `#hud` (`pointer-events: none`) without re-enabling pointer events.
- **Wingmate orientation** in earlier ZOOOM iterations had jets facing perpendicular to flight direction; fixed by replacing `lookAt()` with a `Matrix4.makeBasis()` approach that maps the jet model's local +X (nose) onto the path tangent directly.
- **Wingmate roll direction** was reversed (banked opposite of player input); sign flipped so wingmates now bank into the player's turns.

---

## [v12] — 2026-05-07

### Added
- **NDP-style RSAF fighter flypast** (day-only ambience): 5 jets in arrow formation streak across the bay every ~35–65s with fading white contrails.
- **Star insignia** (★) above the title logo with twinkle + gentle vertical float.
- **Cinematic warm radial bloom** behind the whole title logo.
- **Title intro sequence** (~1.6s, one-shot on first render): wings sweep outward, TOP SUM settles, star drops with a subtle overshoot, subtitle rises last.
- **Ambient title loops**: slow breathing gold pulse on the type; star twinkle + float.
- `@media (prefers-reduced-motion: reduce)` disables all title animations.
- **Sunset unlock celebration** at 1000 pts now includes a full-screen sun-flare bloom, slow-rotating golden sun-rays behind the card, a pulsing halo ring behind the 🌅 icon, and ~46 falling golden sparkle particles in two bursts.
- **`body.sunset-pending` state** glows the in-game ☀ time icon and the title-screen 🌅 Sunset radio until the player engages sunset for the first time (then auto-clears).
- `README.md`, `LICENSE` (MIT), and this `CHANGELOG.md` added to the repo.

### Changed
- **Title logo redesign** — replaced flanking feathered gold wings with a single centered swept-forward delta wing pair in chrome that forms an inverse triangle framing the type, V tip dropping near the · in the subtitle.
- **TOP SUM** now side-by-side same-sized italic gold metallic (was stacked, with SUM in blue).
- Brighter, more inviting gold gradient on the type with a warm amber halo replacing the prior dark vignette.
- Subtitle: letter-spacing tightened ~14%, colour brightened, opacity 0.95 → 1.
- **Open Graph / Twitter card** meta tags now use absolute URLs anchored to `https://mli3w.github.io/top-sum/` with a working `og:image` (previously pointed at a non-existent `share-card.png`).
- `shareScore()` always shares the canonical play URL — never a local `file://` path or query-string variant.

### Fixed
- **Pause overlay buttons** (Resume / Restart / End Flight / Back to Menu) were unclickable on desktop. The overlay sat inside `#hud` (`pointer-events: none`) without re-enabling pointer events on itself.

---

## [v11] — earlier

Path re-route, gate colour scheme, ambient world systems (Chinook + flag, fireworks, MBS Spectra), Sunset Mode unlock at 1000 pts with celebration, single ⏸ pause overlay, first-time onboarding, mobile control tip, Tiny mode arrow assist.

See the comment block at the top of [`index.html`](index.html) for the full v11 / v10 / earlier change history.
