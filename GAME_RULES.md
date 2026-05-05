# GAME_RULES.md — Gemini: The Cosmic Runner
## READ THIS BEFORE TOUCHING ANY CODE. FOLLOW IT STRICTLY.

---

## WHAT IS THIS GAME

React + Vite + TypeScript side-scrolling runner. Gemini (Google AI) runs across 10 worlds defeating rival AIs.
Stack: React 18, Vite 6, TypeScript, Tailwind CSS, Framer Motion (`motion/react`).
Main files: `src/App.tsx` (game logic, 2800+ lines), `src/types.ts` (level data), `src/components/`.

---

## THE 8 AI ENEMIES — NEVER REMOVE OR REPLACE

| Type | Color identity |
|------|---------------|
| `gpt` | Green (#10b981) |
| `claude` | Purple (#a855f7) |
| `copilot` | Blue (#3b82f6) |
| `deepseek` | Sky (#0ea5e9) |
| `llama` | Orange (#f97316) |
| `grok` | Gray (#e5e7eb) |
| `mistral` | Orange-red (#f97316) |
| `perplexity` | Teal (#14b8a6) |

**RULE: All 8 must exist. Never reduce to fewer types. Never replace with generics.**

---

## THE 10 WORLDS — WORLD ORDER IS 10 → 1

Worlds count DOWN. `LEVELS[0]` = World 10, `LEVELS[9]` = World 1.

| World | LEVELS index | Environment key | Theme | Status |
|-------|-------------|-----------------|-------|--------|
| 10 | 0 | `lab` | AI Awakening — Google lab, all 8 AIs debut | ✅ |
| 9  | 1 | `cyberpunk` | The Pursuit — cyberpunk city, helicopter boss | ✅ |
| 8  | 2 | `mad-fields` | Crazy Farm — cows/pigs/sheep, farmer throws animals | ✅ |
| 7  | 3 | `desert` | Wild West — Gemini on horseback, UFO abduction ending | ✅ |
| 6  | 4 | `ship` | Alien UFO corridors — Gemini ON FOOT, alien soldier enemies | ✅ |
| 5  | 5 | `nebula` | Space combat — Gemini PILOTS fighter ship, UFO lasers | ✅ |
| 4  | 6 | `water` | Alien Ocean — after falling from space | ✅ |
| 3  | 7 | `tech` | Digital Jungle — tech environment | ✅ |
| 2  | 8 | `graveyard` | AI Graveyard — zombie/werewolf variants | ✅ |
| 1  | 9 | `void` | THE FINAL SYNC — Google I/O 2026 finale | ✅ |

---

## WORLD-BY-WORLD STRICT RULES

### World 10 (`lab`) — THE AWAKENING
- Environment: white/blue Google-style AI laboratory
- All 8 AI types appear here as intro
- NO farm animals, NO matrix rain, NO ship, NO horse
- Professor variant (lab scientist) throws tools — only in World 10 and World 8

### World 9 (`cyberpunk`) — THE PURSUIT
- Cyberpunk city: dark purple/indigo sky, neon floor, packed building skyline
- All 8 AI types chase Gemini in waves
- Helicopter boss (`variant: "helicopter"`, `behavior: "seeker"`) appears at x≈1500 (mid-level)
- Matrix rain effect is ALLOWED here
- NO farm animals, NO ship, NO horse, NO aliens
- Background buildings must NOT use `Math.random()` in styles — causes flicker on re-render

### World 8 (`mad-fields`) — CRAZY FARM
- ONLY world with: cows (`variant: "cow"`), pigs (`variant: "pig"`), sheep (`variant: "sheep"`)
- Farmer enemy (`variant: "farmer"`) throws animals every 2s — ONLY in World 8
- Tractor decoration bottom-right
- NO cyberpunk, NO aliens, NO ships

### World 7 (`desert`) — WILD WEST
- Gemini RIDES A HORSE (`currentIdx === 3`)
- UFO abduction sequence at worldLength end: beam animation (9s) → advance to World 6
- Gemini + horse are 50% bigger (scale 1.8 landscape)
- NO random cow conversion allowed (excluded from 10% cow chance)
- NO aliens, NO ship

### World 6 (`ship`) — ALIEN CORRIDORS
- Gemini is ON FOOT — NO ship visible, NO flying
- Enemies: alien soldiers only (`variant: "alien"`)
- Environment: dark metal interior, red emergency lights
- NO UFO enemy ships (aliens shoot lasers but are NOT ships)
- NO farm animals, NO horses

### World 5 (`nebula`) — SPACE COMBAT
**CRITICAL: World 5 = pilot ship. World 6 = on foot. NEVER MIX THESE.**
- Gemini PILOTS a fighter ship (`id="fighter-ship"`) — player sprite is hidden (`opacity-0`)
- Ship = Google G horizontal fighter (blue/red/yellow/green stripes, nose pointing RIGHT)
- UFO enemies float 80–260px above ground, shoot phase-based lasers
- Ship fire effect goes on LEFT side (engine/back) — NOT on the nose/right
- End sequence: `isMeteorCrash` → meteor overlay → `isShipOnFire` → ship falls → World 4
- NO on-foot mechanics, NO horse, NO farm animals

### World 4 (`water`) — ALIEN OCEAN
- Gemini lands in ocean after falling from space
- Fish variants and water-themed enemies
- NO ship, NO horse, NO farm animals

### World 3 (`tech`) — DIGITAL JUNGLE
- Tech/digital environment

### World 2 (`graveyard`) — AI GRAVEYARD
- Zombie (`variant: "zombie"`) and werewolf (`variant: "werewolf"`) AI variants allowed here

### World 1 (`void`) — THE FINAL SYNC
- Google I/O 2026 finale
- Void/black space environment

---

## ENEMY VARIANTS — WHERE EACH IS ALLOWED

| Variant | Allowed worlds |
|---------|---------------|
| `normal` | All worlds |
| `cow` | World 8 only (+ 10% random chance in worlds 2,3,4,9) |
| `pig` | World 8 only |
| `sheep` | World 8 only |
| `farmer` | World 8 only |
| `ufo` | World 5 mainly |
| `alien` | World 6 only |
| `helicopter` | World 9 only |
| `horse` | World 7 only |
| `native_rider` | World 7 only |
| `zombie` | World 2 mainly |
| `werewolf` | World 2 mainly |
| `fish` | World 4 mainly |
| `missile` | World 5, 3 |
| `professor` | World 10 only |
| `flask` / `wrench` / `gadget` | World 10 only |

**Random cow (10% chance): EXCLUDED in worlds 5, 6, 7, 10, and for `helicopter` variant.**

---

## TECHNICAL RULES — DO NOT BREAK

### Performance architecture
- Player position = REFS ONLY (`playerXRef`, `playerYRef`, `velocityYRef`)
- Enemy array = `enemiesRef.current` — direct mutation OK
- DOM updated directly in game loop: `document.getElementById('player-wrapper').style.left`
- Do NOT use `setState` for physics/position — causes lag

### LevelBackground.tsx
- One file, early returns per environment (cyberpunk → mad-fields → lab → nebula → ship → generic)
- Parallax via `parallaxNodesRef.current[i]` with `data-depth` attribute
- Indices 0,1,2 = cyberpunk skyline layers
- Indices 50,51,52 = nebula planets (NOT 10,11,12 — known conflict with stars)
- Never use `Math.random()` in JSX style props — generates new values every re-render = visual chaos

### worldLength
- Currently: 4500 for all worlds
- Spawns beyond `worldLength` are UNREACHABLE (portal appears at worldLength)
- Always check spawn x values fit within worldLength when modifying

### Worlds 5 & 6 worldLength exception
- World 5 and 6 are excluded from random cow generation — keep it that way

---

## WHAT YOU MUST NEVER DO

- ❌ Touch other worlds when asked to fix only one specific world
- ❌ Use `Math.random()` in JSX/React render for positions, sizes, or animation delays
- ❌ Put farm animals (cow/pig/sheep/farmer) outside World 8
- ❌ Show Gemini piloting a ship in World 6 (World 6 = ON FOOT)
- ❌ Show Gemini on foot in World 5 (World 5 = SHIP)
- ❌ Change worldLength without checking if existing spawns become unreachable
- ❌ Reduce the number of AI enemy types (must always be 8)
- ❌ Run a `replace_all` on shared constants without checking every world is not broken
- ❌ Add ship fire on the RIGHT/nose side (ship moves right, fire comes from LEFT/engine)
- ❌ Make the interlevel screen use a near-black themeColor (player sees black screen for 2s)

---

## HOW TO START A SESSION SAFELY

1. Read `GAME_RULES.md` (this file)
2. Read `CLAUDE.md` (technical architecture)
3. Read the specific world's section in `src/types.ts`
4. Only modify what was asked — nothing else
5. Verify TypeScript compiles: `npx tsc --noEmit`
