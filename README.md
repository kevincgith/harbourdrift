# 🏎️ Harbour Drift · Hong Kong

> A free arcade-style math driving game through neon Hong Kong.
> Steer your F1 car through the gate with the right answer, ride the flow, chase a high score.

🌐 **Play instantly in your browser:**
👉 https://app.kevinlhc.com/harbourdrift/

No install · No signup · Desktop + Mobile

---

## 🎮 What is Harbour Drift?

Harbour Drift is a fast-paced 3D math game where learning happens through movement, focus, timing and flow.

You drive an F1 car down a curving, hilly road through neon Hong Kong. Every few seconds a gate spans the road with three lanes, each showing a number — steer into the lane with the correct answer to the equation on screen.

Chain correct answers together to build a streak, climb the **FLOW** multiplier, and keep the run going. A wrong answer or an off-target gate costs a life; run out and the race ends.

It's less:
> "solve this question"

and more:
> **stay in your lane, stay in flow, don't break the streak**

---

## 🚀 30-Second Start

1. Open the link above (or `index.html` locally)
2. Pick a difficulty
3. Hit **LIGHTS OUT**
4. Steer (`← →` or `A` / `D`, or the on-screen buttons on mobile) into the gate showing the correct answer
5. Don't break the streak

---

## ⚡ Features

### 🏎️ Arcade Driving Gameplay
- A hand-built F1 car (livery, halo, wings, glowing diffuser) races down a road that curves left/right and rolls over hills
- Three-lane answer gates — steer into the correct number, wrong answers or a bad guess cost a life
- Fast restart loop designed for "one more run"

### 🔥 Flow System
- Consecutive correct answers raise your multiplier: **FLOW ×2** at a 3-streak, **×3** at 5, **×4** at 10
- Speed ramps up with your streak (capped), and resets to base pace after a miss
- Screen flash, confetti burst and a Cantonese cheer (叻仔! 犀利! 勁! 好嘢! 掂晒!) on streak milestones (3, 5, 10, and every 10 after)
- The correct panel lights up green on a miss, so a wrong guess still teaches the right answer

### 🧮 Four Difficulty Levels
| Level      | Operations                                      |
|------------|--------------------------------------------------|
| **Easy**   | Addition, single digits                          |
| **Medium** | Addition and subtraction, up to ~20               |
| **Hard**   | Multi-step: multiplication/division combined with add or subtract |
| **Insane** | Fractions, including reducing and comparing       |

### 🌆 Neon Hong Kong World
- A procedurally streaming skyline of neon-windowed towers alongside a road that curves and hill-rolls continuously
- Glowing pylons, color-cycling arches and lane dashes stream past in sync with the road
- Warm sunset-to-purple sky gradient over the city

### 🎮 Built for Desktop + Mobile
- Keyboard controls (arrows or `A` / `D`)
- On-screen steering buttons on touch devices (auto-hidden when a mouse is detected)
- Mute toggle for the procedural sound effects

### 🚀 Progression
- High-score and best-streak persistence via `localStorage` — no signup
- Final score, best score and longest streak shown at race end, with a **NEW BEST!** callout

---

## 🎯 Controls

### Desktop
| Key | Action |
|-----|--------|
| `←` / `A` | Steer left |
| `→` / `D` | Steer right |

### Mobile
- On-screen **◀** / **▶** buttons, bottom-left and bottom-right
- Tap the speaker icon (top center) to mute/unmute

---

## 🧩 Tech Stack

- Pure HTML / CSS / JavaScript, single file (`index.html`)
- WebGL via [Three.js](https://threejs.org) r128, vendored locally (`vendor/three.r128.min.js`) — no CDN dependency
- Fully client-side — no backend, no accounts, no data collection
- Procedural audio via the Web Audio API — no sound assets

Requires a modern browser with WebGL — Chrome, Safari, Firefox, or Edge on desktop or recent mobile. Shows a friendly fallback message if WebGL isn't available.

### 📊 Analytics

Optional and privacy-first, in two independent tiers (details in [`analytics/`](analytics/README.md)) — **neither is currently wired into `index.html`**, both are dormant scaffolding for future use:

- **Traffic (tier 1):** aggregate visit counts, referrers, and device/country breakdowns via Cloudflare Web Analytics — a single lightweight beacon, no cookies or fingerprinting.
- **Gameplay funnel (tier 2):** an optional Cloudflare Worker + D1 database that would count anonymous gameplay events (race starts, race overs, score shares) as coarse buckets only.

---

## 🚀 Run Locally

No build step, no dependencies. Just clone and open:

```bash
git clone https://github.com/kevincgith/harbourdrift.git
cd harbourdrift

# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

That's it.

---

## 🍴 Fork History

Harbour Drift started as a fork of [Top Sum](https://github.com/mli3w/top-sum), a math flight game over Marina Bay, Singapore. The game itself has since been rebuilt from scratch as an unrelated Hong Kong driving game — see [CHANGELOG.md](CHANGELOG.md) for the inherited version history from before the fork.

---

## 📜 License

[MIT](LICENSE) — fork it, remix it, build on it.
