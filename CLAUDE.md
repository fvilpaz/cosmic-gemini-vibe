# CLAUDE.md — Gemini: The Cosmic Runner

> **⚠️ START HERE: Read `GAME_RULES.md` before making ANY change.**
> GAME_RULES.md = source of truth for worlds, enemies, and what NOT to break.

## What is this project

React + Vite + TypeScript side-scrolling runner game. Gemini (Google AI) runs right across 10 worlds and fights rival AI competitors (GPT, Claude, Grok, Copilot, Llama, etc.). Built for Google I/O 2026 demo. Designed for mobile landscape + desktop.

Stack: React 18, Vite 6, TypeScript, Tailwind CSS, Framer Motion (`motion/react`), Lucide icons.

---

## CRITICAL: Game narrative — world order

Worlds are numbered 10 → 1 (player starts at World 10, ends at World 1). In code: `LEVELS` array index 0 = World 10, index 9 = World 1.

| World | Index | Environment | Narrative |
|-------|-------|-------------|-----------|
| 10 | 0 | `lab` | THE AWAKENING — AI chaos begins. Lab full of AI rivals |
| 9 | 1 | `cyberpunk` | The Pursuit — cyberpunk city chase |
| 8 | 2 | `mad-fields` | Crazy Farm — cows, pigs, sheep, farmer throws animals |
| 7 | 3 | `desert` | Wild West — Gemini on horseback. Ends with UFO abduction of horse |
| 6 | 4 | `ship` | **Gemini on FOOT** inside alien UFO metal corridors. Fights alien soldier AIs. NO ships as enemies |
| 5 | 5 | `nebula` | **Gemini PILOTS fighter ship** through space. UFO enemies shoot lasers. Ends with meteor crash → falls to ocean |
| 4 | 6 | `water` | Alien Ocean — after falling from space |
| 3 | 7 | `tech` | Digital Jungle — tech environment |
| 2 | 8 | `graveyard` | AI Graveyard — dead systems rising |
| 1 | 9 | `void` | THE FINAL SYNC — Google I/O 2026 |

**RULE: World 6 = on foot inside UFO. World 5 = piloting ship in space. Never mix these up.**

---

## Architecture: performance-critical patterns

### Refs vs State — THE most important rule
Physics and position use **refs** to bypass React re-renders. State is only for UI that needs to re-render.

```
playerXRef / playerYRef / velocityYRef  → position (updated every frame, never setState)
enemiesRef     → enemy array (direct mutation OK)
isFlyingRef / isHitRef / isJumpingRef   → flags that game loop reads
```

DOM is updated **directly** in gameLoop, not via state:
```js
document.getElementById('player-wrapper').style.left = `${nX}px`;
document.getElementById('fighter-ship').style.left = `${nX - 40}px`;
```

Camera dispatches a custom event: `window.dispatchEvent(new CustomEvent('updateCamera', { detail: camX }))`. LevelBackground listens to this for parallax.

### Game loop
Single `requestAnimationFrame` loop inside `useCallback(gameLoop, [])`. timeScale normalizes for frame rate: `const timeScale = dt / 16.666`.

---

## Key states and refs

```typescript
// Player position — REFS ONLY
playerXRef, playerYRef, velocityYRef

// Flying (World 5 ship mode + flyer powerup)
isFlying / isFlyingRef / flyTimerRef

// Abduction (World 7 end)
isAbducting / isAbductingRef

// Meteor crash (World 5 end)
isMeteorCrash / isMeteorCrashRef   → triggers meteor shower overlay
isShipOnFire                        → triggers fire on ship (2s after isMeteorCrash)

// Death
deathSequenceRef / showDeathScreen / isDizzy

// Power level (0=normal, 1=powered, 2=super)
powerLevel / powerLevelRef
```

---

## World-specific mechanics

### World 7 (desert / horseback)
- Gemini rides horse (`currentIdx === 3`)
- `isAbducting` triggers at worldLength → UFO beam animation (9s) → advance
- During abduction: Gemini has `powerLevel={0}`, `isFlying={false}`, `isJumping={false}`
- Horse and Gemini are 50% bigger in World 7 (scale 1.8 landscape / 2.25 portrait)

### World 6 (ship / alien corridors)
- Gemini on FOOT — no flying, no ship visible
- 11 alien soldier enemies (`variant: 'alien'`)
- Phase-based laser firing every ~180 frames (~3s)
- Environment: dark metal interior, emergency red lights (see `LevelBackground.tsx` `ship` block)

### World 5 (nebula / fighter ship)
- `isFlying = true` permanently (set in `startLevel` when `level.number === 5`)
- Player is hidden (`opacity-0`), ship takes its place: `id="fighter-ship"`
- Ship = Google G horizontal fighter (blue/red/yellow/green stripes, nose pointing right)
- UFO enemies fire phase-based lasers every ~180 frames
- End sequence: `isMeteorCrash` → meteor overlay (2s) → `isShipOnFire` → ship falls → advance to World 4

### World 8 (mad-fields / farm)
- Farmer + tractor ONLY in World 8. Farmer throws animals (pigs/cows/sheep) every 2s
- Tractor positioned bottom-right, scaled 1.3x toward center

---

## Enemy system

### CompetitorType (AI brands)
`'gpt' | 'claude' | 'grok' | 'copilot' | 'llama' | 'mistral' | 'perplexity' | 'deepseek' | 'prompt'`

### CompetitorVariant
`'normal' | 'cow' | 'zombie' | 'werewolf' | 'fish' | 'ufo' | 'sheep' | 'pig' | 'farmer' | 'missile' | 'target' | 'horse' | 'native' | 'native_rider' | 'alien'`

### Enemy behaviors
`walk | roll | fall | bounce | sprint | jump | back | seeker | laser | thrown`

- `laser` variant: `enemy_laser` — flies left at speed 7, spawned by UFOs or aliens
- `seeker` — tracks Gemini's Y position
- `bounce` + UFO in World 5 → floats 80-260px above ground

### Random cow chance
10% chance any AI enemy becomes a cow, EXCEPT in Worlds 5, 6, 7.

---

## LevelBackground.tsx

One component, early returns per environment:
- `mad-fields` → green hills, farm, fence, platforms
- `lab` → circuit floor, holographic screens, data streams
- `nebula` → deep space, 3 star layers, 3 planets, nebula clouds
- `ship` → dark metal, emergency red lights, wall panels, striped floor
- generic return → handles: `water`, `desert`, `tech`, `graveyard`, `moon`, `void`, `cyberpunk` etc.

### KNOWN BUG in nebula: parallaxNodesRef conflict
Close fast stars use `parallaxNodesRef.current[i]` for i=0..39.
Planets use indices 10, 11, 12. Supernova uses index 20.
Stars OVERWRITE planet refs → planets scroll at wrong speed.
**Fix needed**: change planets to indices 50, 51, 52 and supernova to 53.

---

## UI Screens

| Screen | Trigger | Key text |
|--------|---------|----------|
| Menu | `gameState === 'menu'` | "VIBE GAME", "START DISCOVERY" |
| Interlevel | `gameState === 'interlevel'` | 2s, shows rival + planet name |
| HUD | `gameState === 'playing'` | progress bar, planet name, touch controls |
| Death cinematic | `showDeathScreen` | dizzy Gemini, white flash |
| Game over | `gameState === 'gameover'` | "SYSTEM CRASH.", "REBOOT MISSION" |
| Complete | `gameState === 'complete'` | "UNITY", "Gemini has unified the 10 dimensions" |
| Transform | `isTransforming` | "SUPER GEMINI" flash |
| Abduction | `isAbducting` | UFO beam, horse rears up |
| Meteor crash | `isMeteorCrash` | 14 diagonal meteors, explosion |

---

## World names (all translated to English)

All `planetName` fields in `types.ts` are in English. No Spanish text remaining.

---

## File map

```
src/
  App.tsx                    — main game (2800+ lines), all game logic
  types.ts                   — LEVELS array, Level/Platform interfaces
  components/
    GeminiRunner.tsx         — player character animation
    Competitor.tsx           — all enemy visuals (includes 'alien' variant)
    LevelBackground.tsx      — per-environment backgrounds
    TransitionGame.tsx       — mini shooter game shown during void/nebula transitions
    Portal.tsx               — end-of-level portal
    Dollar.tsx               — collectible coins
    Flyer.tsx                — flying powerup collectible
    Projectile.tsx           — player-fired tokens
    RotateScreen.tsx         — mobile portrait warning
```

---

## Dev server

```bash
npm run dev   # starts on http://localhost:3000
```
