import { CompetitorType } from "./components/Competitor";

export interface Platform {
  x: number;
  y: number;
  width: number;
}

export interface Level {
  number: number;
  planetName: string;
  themeColor: string;
  secondaryColor: string;
  environment:
    | "mad-fields"
    | "desert"
    | "water"
    | "tech"
    | "nebula"
    | "ice"
    | "lava"
    | "forest"
    | "tundra"
    | "void"
    | "star"
    | "graveyard"
    | "halloween"
    | "moon"
    | "ship"
    | "cyberpunk"
    | "lab"
    | "matrix";
  coyoteAction: string;
  rivalType: CompetitorType;
  terrainType: "islands" | "flat" | "craggy" | "geometric";
  particleColor: string;
  worldLength: number;
  enemySpawns: {
    x: number;
    type: CompetitorType | "prompt";
    variant?:
      | "normal"
      | "cow"
      | "ghost"
      | "zombie"
      | "werewolf"
      | "fish"
      | "octopus"
      | "jellyfish"
      | "ufo"
      | "sheep"
      | "pig"
      | "farmer"
      | "missile"
      | "horse"
      | "native"
      | "native_rider"
      | "alien"
      | "professor"
      | "flask"
      | "wrench"
      | "gadget"
      | "helicopter"
      | "agent";
    behavior?:
      | "walk"
      | "roll"
      | "fall"
      | "bounce"
      | "sprint"
      | "jump"
      | "back"
      | "seeker"
      | "laser"
      | "idle";
    size?: number;
    text?: string;
    y?: number;
  }[];
  dollarSpawns: number[];
  flyerSpawns: number[];
  platforms: Platform[];
}

export const LEVELS: Level[] = [
  // ─── INDEX 0 — WORLD 10: El Despertar de la IA ───────────────────────────
  {
    number: 10,
    planetName: "World 10 — THE AWAKENING — AI Genesis",
    themeColor: "from-blue-950 via-sky-900 to-black",
    secondaryColor: "text-blue-300",
    environment: "lab",
    terrainType: "flat",
    particleColor: "#3b82f6",
    coyoteAction: "SYNTHESIS IN PROGRESS",
    rivalType: "gpt",
    worldLength: 4500,
    enemySpawns: [
      { x: 800,  type: "gpt", variant: "professor", behavior: "walk", size: 1.0 },
      { x: 1200, type: "gpt", behavior: "sprint", size: 1.2 },
      { x: 1600, type: "deepseek", behavior: "walk", size: 1.4 },
      { x: 2000, type: "mistral", behavior: "walk", size: 1.4 },
      { x: 2500, type: "grok", behavior: "walk", size: 1.7 },
      { x: 3000, type: "mistral", behavior: "sprint", size: 1.2 },
      { x: 3500, type: "llama", behavior: "sprint", size: 1.6 },
      { x: 4000, type: "grok", behavior: "walk", size: 1.5 },
      { x: 4300, type: "perplexity", behavior: "walk", size: 1.4 },
      { x: 4400, type: "claude", behavior: "walk", size: 1.3 },
    ],
    dollarSpawns: [1000, 2000, 3000, 4000],
    flyerSpawns: [1500, 3500],
    platforms: [
      { x: 1000, y: 150, width: 200 },
      { x: 2500, y: 200, width: 250 },
      { x: 3500, y: 100, width: 200 },
    ],
  },

  // ─── INDEX 1 — WORLD 9: The Pursuit ──────────────────────────────────────
  {
    number: 9,
    planetName: "World 9 — The Pursuit",
    themeColor: "from-gray-900 via-slate-800 to-black",
    secondaryColor: "text-slate-300",
    environment: "cyberpunk",
    terrainType: "flat",
    particleColor: "#94a3b8",
    coyoteAction: "INTRUDER DETECTED",
    rivalType: "gpt",
    worldLength: 5200,
    enemySpawns: [
      // WAVE 1 — First contact
      { x: 900,  type: "gpt",        variant: "normal",     behavior: "sprint", size: 1.2 },
      { x: 1150, type: "claude",     variant: "normal",     behavior: "sprint", size: 1.1 },
      { x: 1400, type: "copilot",    variant: "normal",     behavior: "roll",   size: 1.2 },
      { x: 1700, type: "grok",       variant: "normal",     behavior: "sprint", size: 1.3 },
      // HELICOPTER BOSS 1
      { x: 2100, type: "gpt",        variant: "helicopter", behavior: "seeker", size: 2.2 },
      { x: 2350, type: "deepseek",   variant: "normal",     behavior: "sprint", size: 1.4 },
      // WAVE 2 — Escalation
      { x: 2500, type: "llama",      variant: "normal",     behavior: "sprint", size: 1.3 },
      { x: 2750, type: "mistral",    variant: "normal",     behavior: "roll",   size: 1.2 },
      { x: 3000, type: "deepseek",   variant: "normal",     behavior: "sprint", size: 1.4 },
      { x: 3300, type: "perplexity", variant: "normal",     behavior: "bounce", size: 1.3 },
      { x: 3500, type: "gpt",        variant: "normal",     behavior: "sprint", size: 1.2 },
      // HELICOPTER BOSS 2
      { x: 3700, type: "claude",     variant: "helicopter", behavior: "seeker", size: 2.0 },
      { x: 3900, type: "copilot",    variant: "normal",     behavior: "sprint", size: 1.3 },
      // WAVE 3 — Chase intensifies
      { x: 4100, type: "gpt",        variant: "normal",     behavior: "sprint", size: 1.5 },
      { x: 4350, type: "claude",     variant: "normal",     behavior: "roll",   size: 1.4 },
      { x: 4550, type: "copilot",    variant: "normal",     behavior: "sprint", size: 1.3 },
      { x: 4750, type: "grok",       variant: "normal",     behavior: "sprint", size: 1.5 },
      // WAVE 4 — Final sprint
      { x: 4950, type: "llama",      variant: "normal",     behavior: "sprint", size: 1.6 },
      { x: 5050, type: "mistral",    variant: "normal",     behavior: "sprint", size: 1.4 },
    ],
    dollarSpawns: [700, 1600, 2700, 3800, 4900],
    flyerSpawns: [2200, 4000],
    platforms: [
      { x: 1300, y: 150, width: 250 },
      { x: 3200, y: 200, width: 200 },
    ],
  },

  // ─── INDEX 2 — WORLD 8: La Granja Loca / MOO ERROR 404 ───────────────────
  {
    number: 8,
    planetName: "World 8 — The Crazy Farm / MOO ERROR 404",
    themeColor: "from-green-600 via-lime-700 to-red-900",
    secondaryColor: "text-yellow-200",
    environment: "mad-fields",
    terrainType: "geometric",
    particleColor: "#bef264",
    coyoteAction: "ABSOLUTE COW DOMINANCE",
    rivalType: "gpt",
    worldLength: 4500,
    enemySpawns: [
      { x: 800,  type: "gpt", variant: "pig",    behavior: "fall",   size: 1.0 },
      { x: 1200, type: "gpt", variant: "pig",    behavior: "fall",   size: 1.0 },
      { x: 1600, type: "gpt", variant: "pig",    behavior: "fall",   size: 1.0 },
      { x: 2000, type: "gpt", variant: "pig",    behavior: "fall",   size: 1.0 },
      { x: 2500, type: "gpt", variant: "farmer", behavior: "walk",   size: 1.2 },
      { x: 3000, type: "gpt", variant: "cow",    behavior: "sprint", size: 0.9 },
      { x: 3500, type: "gpt", variant: "farmer", behavior: "walk",   size: 1.2 },
      { x: 4000, type: "gpt", variant: "cow",    behavior: "sprint", size: 1.1 },
    ],
    dollarSpawns: [900, 1800, 2700, 3600],
    flyerSpawns: [1400, 2500, 3800],
    platforms: [
      { x: 800,  y: 250, width: 400 },
      { x: 2200, y: 300, width: 400 },
    ],
  },

  // ─── INDEX 3 — WORLD 7: El Oeste — Ride or Die ───────────────────────────
  {
    number: 7,
    planetName: "World 7 — Ride or Die — Wild West AI",
    themeColor: "from-amber-600 via-orange-800 to-red-950",
    secondaryColor: "text-yellow-100",
    environment: "desert",
    terrainType: "flat",
    particleColor: "#f59e0b",
    coyoteAction: "DRAW PARTNER!",
    rivalType: "gpt",
    worldLength: 4500,
    enemySpawns: [
      { x: 700,  type: "gpt",        variant: "native", behavior: "walk", size: 1.1 },
      { x: 900,  type: "gpt",        variant: "native_rider", behavior: "walk", size: 1.1 },
      { x: 1200, type: "claude",     variant: "native",       behavior: "walk", size: 1.0 },
      { x: 1400, type: "mistral",    variant: "native",       behavior: "walk", size: 1.0 },
      { x: 1700, type: "copilot",    variant: "native_rider", behavior: "walk", size: 1.2 },
      { x: 1900, type: "copilot",    variant: "native",       behavior: "walk", size: 1.1 },
      { x: 2200, type: "deepseek",   variant: "native",       behavior: "walk", size: 1.1 },
      { x: 2400, type: "deepseek",   variant: "native_rider", behavior: "walk", size: 1.1 },
      { x: 2700, type: "llama",      variant: "native",       behavior: "walk", size: 1.0 },
      { x: 2900, type: "llama",      variant: "native_rider", behavior: "walk", size: 1.0 },
      { x: 3200, type: "grok",       variant: "native",       behavior: "walk", size: 1.1 },
      { x: 3400, type: "grok",       variant: "native_rider", behavior: "walk", size: 1.2 },
      { x: 3700, type: "mistral",    variant: "native",       behavior: "walk", size: 1.2 },
      { x: 3900, type: "mistral",    variant: "native_rider", behavior: "walk", size: 1.1 },
      { x: 4200, type: "perplexity", variant: "native",       behavior: "walk", size: 1.1 },
      { x: 4400, type: "perplexity", variant: "native_rider", behavior: "walk", size: 1.1 },
    ],
    dollarSpawns: [1000, 2000, 3000, 4200],
    flyerSpawns: [1600, 3400],
    platforms: [
      { x: 1200, y: 200, width: 300 },
      { x: 2800, y: 150, width: 250 },
    ],
  },

  // ─── INDEX 4 — WORLD 6: Nave Alien — Escape Protocol ─────────────────────
  {
    number: 6,
    planetName: "World 6 — Alien Ship — Escape Protocol",
    themeColor: "from-slate-900 via-zinc-900 to-red-950",
    secondaryColor: "text-green-400",
    environment: "ship",
    terrainType: "geometric",
    particleColor: "#22c55e",
    coyoteAction: "ALIEN SCAN DETECTED",
    rivalType: "grok",
    worldLength: 4500,
    enemySpawns: [
      { x: 800,  type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 1200, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 1600, type: "grok", variant: "alien", behavior: "walk", size: 1.0 },
      { x: 2000, type: "gpt", variant: "alien", behavior: "sprint", size: 1.2 },
      { x: 2400, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 2800, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 3200, type: "gpt", variant: "alien", behavior: "walk", size: 1.4 },
      { x: 3600, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 3900, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 4200, type: "grok", variant: "alien", behavior: "walk", size: 1.0 },
    ],
    dollarSpawns: [1000, 2000, 3000, 4000],
    flyerSpawns: [1800, 3500],
    platforms: [
      { x: 800, y: 200, width: 200 },
      { x: 2500, y: 250, width: 300 },
    ],
  },

  // ─── INDEX 5 — WORLD 5: La Galaxia — UFO Invasion ────────────────────────
  {
    number: 5,
    planetName: "World 5 — The Galaxy — UFO Invasion",
    themeColor: "from-indigo-950 via-violet-950 to-black",
    secondaryColor: "text-purple-300",
    environment: "nebula",
    terrainType: "geometric",
    particleColor: "#8b5cf6",
    coyoteAction: "UFO ATTACK INCOMING",
    rivalType: "grok",
    worldLength: 4500,
    enemySpawns: [
      { x: 800, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 1200, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 1600, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 2000, type: "grok", variant: "ufo", behavior: "bounce", size: 1.4 },
      { x: 2400, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 2800, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 3200, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 3600, type: "grok", variant: "ufo", behavior: "bounce", size: 1.4 },
      { x: 4000, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 4300, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
    ],
    dollarSpawns: [1200, 2400, 3600],
    flyerSpawns: [1800, 3200],
    platforms: [
      { x: 1000, y: 200, width: 300 },
      { x: 3000, y: 250, width: 400 },
    ],
  },

  // ─── INDEX 6 — WORLD 4: Océano Alienígena ────────────────────────────────
  {
    number: 4,
    planetName: "World 4 — Cyber Abyss — Deep Ocean",
    themeColor: "from-blue-950 via-cyan-900 to-black",
    secondaryColor: "text-cyan-400",
    environment: "water",
    terrainType: "geometric",
    particleColor: "#22d3ee",
    coyoteAction: "DEEP PRESSURE DETECTED",
    rivalType: "llama",
    worldLength: 4500,
    enemySpawns: [
      { x: 800,  type: "gpt", variant: "fish", behavior: "walk", size: 1.0 },
      { x: 1200, type: "claude", variant: "octopus", behavior: "walk", size: 1.2 },
      { x: 1600, type: "grok", variant: "jellyfish", behavior: "walk", size: 1.1 },
      { x: 2000, type: "gpt", variant: "octopus", behavior: "sprint", size: 1.2 },
      { x: 2400, type: "llama", variant: "jellyfish", behavior: "walk", size: 1.3 },
      { x: 2800, type: "llama", variant: "fish", behavior: "walk", size: 1.3 },
      { x: 3200, type: "copilot", variant: "octopus", behavior: "walk", size: 1.4 },
      { x: 3600, type: "gpt", variant: "fish", behavior: "walk", size: 1.0 },
      { x: 3900, type: "mistral", variant: "jellyfish", behavior: "walk", size: 1.1 },
      { x: 4200, type: "grok", variant: "octopus", behavior: "walk", size: 1.0 },
    ],
    dollarSpawns: [1000, 2000, 3000, 4000],
    flyerSpawns: [1800, 3500],
    platforms: [
      { x: 800, y: 200, width: 200 },
      { x: 2500, y: 250, width: 300 },
    ],
  },

  // ─── INDEX 7 — WORLD 3: Halloween Nightmare ───────────────────────────
  {
    number: 3,
    planetName: "World 3 — Halloween Nightmare — AI Graveyard",
    themeColor: "from-[#1a0b33] via-[#4d1d66] to-black",
    secondaryColor: "text-orange-400",
    environment: "halloween",
    terrainType: "geometric",
    particleColor: "#f97316",
    coyoteAction: "HALLOWEEN PROTOCOL ACTIVE",
    rivalType: "mistral",
    worldLength: 4500,
    enemySpawns: [
      { x: 700, type: "gpt", variant: "zombie", behavior: "walk", size: 1.4 },
      { x: 1100, type: "claude", variant: "ghost", behavior: "sprint", size: 1.3 },
      { x: 1500, type: "llama", variant: "zombie", behavior: "walk", size: 1.5 },
      { x: 1900, type: "mistral", variant: "ghost", behavior: "bounce", size: 1.4 },
      { x: 2300, type: "gpt", variant: "zombie", behavior: "roll", size: 1.2 },
      { x: 2700, type: "copilot", variant: "ghost", behavior: "walk", size: 1.4 },
      { x: 3100, type: "deepseek", variant: "zombie", behavior: "sprint", size: 1.3 },
      { x: 3500, type: "grok", variant: "ghost", behavior: "bounce", size: 1.5 },
      { x: 3900, type: "mistral", variant: "zombie", behavior: "walk", size: 1.6 },
      { x: 4300, type: "gpt", variant: "ghost", behavior: "roll", size: 1.3 },
    ],
    dollarSpawns: [1200, 2400, 3600],
    flyerSpawns: [2000, 4000],
    platforms: [
      { x: 800, y: 220, width: 300 },
      { x: 1500, y: 150, width: 250 },
      { x: 2400, y: 280, width: 400 },
      { x: 3400, y: 200, width: 300 },
    ],
  },

  // ─── INDEX 8 — WORLD 2: The Construct — System Core ──────────────
  {
    number: 2,
    planetName: "World 2 — THE CONSTRUCT — System Core",
    themeColor: "from-[#001a00] via-[#000a00] to-black",
    secondaryColor: "text-emerald-500",
    environment: "matrix",
    terrainType: "geometric",
    particleColor: "#059669",
    coyoteAction: "WAKE UP, NEO...",
    rivalType: "claude",
    worldLength: 4500,
    enemySpawns: [
      { x: 800, type: "gpt", variant: "agent", behavior: "walk", size: 1.2 },
      { x: 1200, type: "claude", variant: "agent", behavior: "sprint", size: 1.0 },
      { x: 1600, type: "copilot", variant: "agent", behavior: "roll", size: 1.3 },
      { x: 2000, type: "deepseek", variant: "agent", behavior: "walk", size: 1.1 },
      { x: 2400, type: "gpt", variant: "agent", behavior: "sprint", size: 1.4 },
      { x: 2800, type: "llama", variant: "agent", behavior: "bounce", size: 1.2 },
      { x: 3200, type: "mistral", variant: "agent", behavior: "walk", size: 1.5 },
      { x: 3600, type: "grok", variant: "agent", behavior: "sprint", size: 1.3 },
      { x: 4000, type: "perplexity", variant: "agent", behavior: "roll", size: 1.1 },
      { x: 4400, type: "claude", variant: "agent", behavior: "bounce", size: 1.6 },
    ],
    dollarSpawns: [1000, 2500, 4000],
    flyerSpawns: [2000, 3500],
    platforms: [
      { x: 1200, y: 200, width: 300 },
      { x: 2500, y: 250, width: 300 },
      { x: 3800, y: 200, width: 300 },
    ],
  },

  // ─── INDEX 9 — WORLD 1: The Final Sync — Google I/O 2026 ─────────────────
  {
    number: 1,
    planetName: "World 1 — THE FINAL SYNC — Google I/O 2026",
    themeColor: "from-violet-950 via-fuchsia-900 to-black",
    secondaryColor: "text-fuchsia-300",
    environment: "void",
    terrainType: "geometric",
    particleColor: "#d946ef",
    coyoteAction: "FINAL SYNC INITIATED",
    rivalType: "gpt",
    worldLength: 4500,
    enemySpawns: [
      { x: 600,  type: "gpt",        variant: "professor",    behavior: "idle", size: 1.8 },
      { x: 850,  type: "claude",     variant: "farmer",       behavior: "idle", size: 1.8 },
      { x: 1100, type: "copilot",    variant: "native_rider", behavior: "idle", size: 1.8 },
      { x: 1350, type: "deepseek",   variant: "native",       behavior: "idle", size: 1.8 },
      { x: 1600, type: "llama",      variant: "octopus",      behavior: "idle", size: 1.8 },
      { x: 1850, type: "grok",       variant: "jellyfish",    behavior: "idle", size: 1.8 },
      { x: 2100, type: "mistral",    variant: "zombie",       behavior: "idle", size: 1.8 },
      { x: 2350, type: "perplexity", variant: "werewolf",     behavior: "idle", size: 1.8 },
      { x: 2600, type: "gpt",        variant: "ghost",        behavior: "idle", size: 1.8 },
      { x: 2850, type: "claude",     variant: "agent",        behavior: "idle", size: 1.8 },
      { x: 3100, type: "copilot",    variant: "alien",        behavior: "idle", size: 1.8 },
      { x: 3350, type: "deepseek",   variant: "ufo",          behavior: "idle", size: 1.8 },
      { x: 3600, type: "llama",      variant: "fish",         behavior: "idle", size: 1.8 },
      { x: 3850, type: "grok",       variant: "cow",          behavior: "idle", size: 1.8 },
      { x: 4100, type: "mistral",    variant: "sheep",        behavior: "idle", size: 1.8 },
      { x: 4350, type: "perplexity", variant: "pig",          behavior: "idle", size: 1.8 },
    ],
    dollarSpawns: [],
    flyerSpawns: [],
    platforms: [
      { x: 800, y: 120, width: 300 },
      { x: 2500, y: 100, width: 250 },
      { x: 3800, y: 140, width: 300 },
    ],
  },
];
