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
    | "moon"
    | "ship"
    | "cyberpunk"
    | "lab";
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
      | "zombie"
      | "werewolf"
      | "fish"
      | "ufo"
      | "sheep"
      | "pig"
      | "farmer"
      | "missile"
      | "target"
      | "horse"
      | "native"
      | "native_rider"
      | "alien"
      | "professor"
      | "flask"
      | "wrench"
      | "gadget"
      | "helicopter";
    behavior?:
      | "walk"
      | "roll"
      | "fall"
      | "bounce"
      | "sprint"
      | "jump"
      | "back"
      | "seeker"
      | "laser";
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
      { x: 600, type: "gpt", variant: "professor", behavior: "walk", size: 1.0 },
      { x: 800, type: "gpt", behavior: "sprint", size: 1.2 },
      { x: 1261, type: "deepseek", behavior: "walk", size: 1.4 },
      { x: 1859, type: "gpt", behavior: "walk", size: 1.3 },
      { x: 2547, type: "mistral", behavior: "walk", size: 1.4 },
      { x: 3011, type: "mistral", behavior: "sprint", size: 1.1 },
      { x: 3449, type: "grok", behavior: "walk", size: 1.7 },
      { x: 4082, type: "gpt", behavior: "walk", size: 1.2 },
      { x: 4774, type: "mistral", behavior: "sprint", size: 1.2 },
      { x: 5418, type: "llama", behavior: "sprint", size: 1.6 },
      { x: 6037, type: "grok", behavior: "sprint", size: 1.1 },
      { x: 6454, type: "grok", behavior: "walk", size: 1.2 },
      { x: 7053, type: "deepseek", behavior: "walk", size: 1.5 },
      { x: 7587, type: "grok", behavior: "walk", size: 1.5 },
      { x: 8097, type: "perplexity", behavior: "walk", size: 1.4 },
      { x: 8612, type: "claude", behavior: "walk", size: 1.3 },
      { x: 9349, type: "deepseek", behavior: "walk", size: 1.8 },
    ],
    dollarSpawns: [1500, 3000, 4500, 6000, 7500, 9000],
    flyerSpawns: [2500, 5000, 7500],
    platforms: [
      { x: 1000, y: 150, width: 200 },
      { x: 2500, y: 200, width: 250 },
      { x: 4500, y: 300, width: 300 },
      { x: 6500, y: 250, width: 350 },
      { x: 8000, y: 200, width: 200 },
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
    worldLength: 4500,
    enemySpawns: [
      // WAVE 1 — First contact
      { x: 350,  type: "gpt",        variant: "normal",     behavior: "sprint", size: 1.2 },
      { x: 650,  type: "claude",     variant: "normal",     behavior: "sprint", size: 1.1 },
      { x: 950,  type: "copilot",    variant: "normal",     behavior: "roll",   size: 1.2 },
      { x: 1250, type: "grok",       variant: "normal",     behavior: "sprint", size: 1.3 },
      // HELICOPTER BOSS — appears mid-level
      { x: 1500, type: "gpt",        variant: "helicopter", behavior: "seeker", size: 2.2 },
      // WAVE 2 — Escalation
      { x: 1800, type: "llama",      variant: "normal",     behavior: "sprint", size: 1.3 },
      { x: 2050, type: "mistral",    variant: "normal",     behavior: "roll",   size: 1.2 },
      { x: 2300, type: "deepseek",   variant: "normal",     behavior: "sprint", size: 1.4 },
      { x: 2600, type: "perplexity", variant: "normal",     behavior: "bounce", size: 1.3 },
      // WAVE 3 — Chase intensifies
      { x: 2900, type: "gpt",        variant: "normal",     behavior: "sprint", size: 1.5 },
      { x: 3150, type: "claude",     variant: "normal",     behavior: "roll",   size: 1.4 },
      { x: 3350, type: "copilot",    variant: "normal",     behavior: "sprint", size: 1.3 },
      { x: 3550, type: "grok",       variant: "normal",     behavior: "sprint", size: 1.5 },
      // WAVE 4 — Final sprint
      { x: 3750, type: "llama",      variant: "normal",     behavior: "sprint", size: 1.6 },
      { x: 3950, type: "mistral",    variant: "normal",     behavior: "sprint", size: 1.4 },
      { x: 4150, type: "deepseek",   variant: "normal",     behavior: "sprint", size: 1.5 },
      { x: 4350, type: "gpt",        variant: "normal",     behavior: "sprint", size: 1.7 },
    ],
    dollarSpawns: [500, 1400, 2300, 3200, 4100],
    flyerSpawns: [1700, 3300],
    platforms: [
      { x: 1000, y: 150, width: 250 },
      { x: 2800, y: 200, width: 200 },
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
      { x: 600, type: "gpt", variant: "pig", behavior: "fall", size: 1.5 },
      { x: 1197, type: "gpt", variant: "pig", behavior: "fall", size: 1.5 },
      { x: 1500, type: "gpt", variant: "pig", behavior: "fall", size: 1.5 },
      { x: 2037, type: "gpt", variant: "pig", behavior: "fall", size: 1.5 },
      { x: 2640, type: "gpt", variant: "pig", behavior: "fall", size: 1.5 },
      { x: 3500, type: "gpt", variant: "farmer", behavior: "walk", size: 1.7 },
      { x: 4127, type: "gpt", variant: "farmer", behavior: "walk", size: 1.7 },
      { x: 4773, type: "gpt", variant: "farmer", behavior: "walk", size: 1.7 },
      { x: 5296, type: "gpt", variant: "farmer", behavior: "walk", size: 1.7 },
      { x: 5796, type: "gpt", variant: "farmer", behavior: "walk", size: 1.7 },
      { x: 6567, type: "gpt", variant: "cow", behavior: "walk", size: 1.3 },
      { x: 7000, type: "gpt", variant: "pig", behavior: "sprint", size: 2.0 },
      { x: 7679, type: "gpt", variant: "pig", behavior: "sprint", size: 2.0 },
      { x: 8182, type: "gpt", variant: "pig", behavior: "sprint", size: 2.0 },
      { x: 8690, type: "gpt", variant: "pig", behavior: "sprint", size: 2.0 },
      { x: 9289, type: "gpt", variant: "pig", behavior: "sprint", size: 2.0 },
    ],
    dollarSpawns: [1200, 3200, 5200, 7200, 9200, 6500, 8000, 9500],
    flyerSpawns: [6500, 8500, 6000, 8500],
    platforms: [
      { x: 1000, y: 250, width: 400 },
      { x: 3000, y: 300, width: 400 },
      { x: 5000, y: 250, width: 400 },
      { x: 7000, y: 300, width: 400 },
      { x: 9000, y: 250, width: 400 },
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
      {
        x: 800,
        type: "gpt",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.1,
      },
      {
        x: 1300,
        type: "claude",
        variant: "native",
        behavior: "sprint",
        size: 1.0,
      },
      {
        x: 1800,
        type: "copilot",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.2,
      },
      {
        x: 2300,
        type: "deepseek",
        variant: "native",
        behavior: "walk",
        size: 1.1,
      },
      {
        x: 2800,
        type: "llama",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.0,
      },
      {
        x: 3300,
        type: "grok",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.2,
      },
      {
        x: 3800,
        type: "mistral",
        variant: "native",
        behavior: "sprint",
        size: 1.1,
      },
      {
        x: 4300,
        type: "perplexity",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.0,
      },
      {
        x: 4700,
        type: "gpt",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.1,
      },
      ,
      {
        x: 5256,
        type: "claude",
        variant: "native",
        behavior: "sprint",
        size: 1.0,
      },
      ,
      {
        x: 5747,
        type: "copilot",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.2,
      },
      ,
      {
        x: 6157,
        type: "deepseek",
        variant: "native",
        behavior: "walk",
        size: 1.1,
      },
      ,
      {
        x: 6521,
        type: "llama",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.0,
      },
      ,
      {
        x: 6953,
        type: "grok",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.2,
      },
      ,
      {
        x: 7292,
        type: "mistral",
        variant: "native",
        behavior: "sprint",
        size: 1.1,
      },
      ,
      {
        x: 7889,
        type: "perplexity",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.0,
      },
      {
        x: 8495,
        type: "gpt",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.1,
      },
      ,
      {
        x: 8807,
        type: "claude",
        variant: "native",
        behavior: "sprint",
        size: 1.0,
      },
      ,
      {
        x: 9124,
        type: "copilot",
        variant: "native_rider",
        behavior: "sprint",
        size: 1.2,
      },
      ,
      {
        x: 9781,
        type: "deepseek",
        variant: "native",
        behavior: "walk",
        size: 1.1,
      },
    ],
    dollarSpawns: [1200, 2800, 4000, 6500, 8000, 9500],
    flyerSpawns: [2000, 6000, 8500],
    platforms: [
      { x: 1500, y: 200, width: 300 },
      { x: 2800, y: 150, width: 200 },
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
      { x: 600, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 1111, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 1800, type: "grok", variant: "alien", behavior: "walk", size: 1.0 },
      { x: 2300, type: "gpt", variant: "alien", behavior: "sprint", size: 1.2 },
      { x: 3100, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 3794, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 4200, type: "gpt", variant: "alien", behavior: "walk", size: 1.4 },
      { x: 4600, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 5123, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 5725, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
      { x: 6192, type: "grok", variant: "alien", behavior: "walk", size: 1.0 },
      { x: 6785, type: "gpt", variant: "alien", behavior: "sprint", size: 1.2 },
      { x: 7681, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 8213, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 8748, type: "llama", variant: "alien", behavior: "walk", size: 1.3 },
      { x: 9049, type: "gpt", variant: "alien", behavior: "walk", size: 1.4 },
      { x: 9491, type: "gpt", variant: "normal", behavior: "walk", size: 1.0 },
    ],
    dollarSpawns: [1000, 2500, 4000, 6500, 8000, 9500],
    flyerSpawns: [2000, 6000, 8500],
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
      { x: 600, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 1274, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 1800, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 2489, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 2800, type: "grok", variant: "ufo", behavior: "bounce", size: 1.4 },
      { x: 3400, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 4033, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 4615, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 5451, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 6182, type: "grok", variant: "ufo", behavior: "bounce", size: 1.4 },
      { x: 6790, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 7367, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 8000, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 8608, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
      { x: 9287, type: "gpt", variant: "ufo", behavior: "bounce", size: 1.2 },
    ],
    dollarSpawns: [1500, 3000, 4500, 6500, 8000, 9500],
    flyerSpawns: [2500, 6000, 8500],
    platforms: [
      { x: 1000, y: 200, width: 200 },
      { x: 3000, y: 250, width: 300 },
    ],
  },

  // ─── INDEX 6 — WORLD 4: Océano Alienígena ────────────────────────────────
  {
    number: 4,
    planetName: "World 4 — Alien Ocean",
    themeColor: "from-blue-900 via-cyan-900 to-black",
    secondaryColor: "text-cyan-200",
    environment: "water",
    terrainType: "craggy",
    particleColor: "#06b6d4",
    coyoteAction: "SUBMARINE ATTACK",
    rivalType: "llama",
    worldLength: 4500,
    enemySpawns: [
      { x: 600, type: "gpt", variant: "normal", behavior: "walk", size: 1.5 },
      { x: 1200, type: "llama", behavior: "sprint", size: 1.5 },
      { x: 1850, type: "llama", behavior: "sprint", size: 1.5 },
      { x: 2200, type: "gpt", behavior: "sprint", size: 1.5 },
      { x: 2828, type: "gpt", behavior: "sprint", size: 1.5 },
      { x: 3474, type: "gpt", behavior: "sprint", size: 1.5 },
      { x: 4200, type: "llama", behavior: "sprint", size: 1.8 },
      { x: 4923, type: "claude", variant: "cow", behavior: "roll", size: 1.5 },
      { x: 5323, type: "gpt", variant: "normal", behavior: "walk", size: 1.5 },
      { x: 5911, type: "llama", behavior: "sprint", size: 1.5 },
      { x: 6443, type: "llama", behavior: "sprint", size: 1.5 },
      { x: 7043, type: "llama", behavior: "sprint", size: 1.5 },
      { x: 7658, type: "gpt", behavior: "sprint", size: 1.5 },
      { x: 8182, type: "gpt", behavior: "sprint", size: 1.5 },
      { x: 8726, type: "gpt", behavior: "sprint", size: 1.5 },
      { x: 9331, type: "gpt", behavior: "sprint", size: 1.5 },
    ],
    dollarSpawns: [1800, 3200, 4800, 6500, 8000, 9500],
    flyerSpawns: [3000, 6000, 8500],
    platforms: [
      { x: 1000, y: 180, width: 250 },
      { x: 2500, y: 280, width: 400 },
    ],
  },

  // ─── INDEX 7 — WORLD 3: Jungla Digital / The Green Cascade ───────────────
  {
    number: 3,
    planetName: "World 3 — Digital Jungle — The Green Cascade",
    themeColor: "from-black to-emerald-950",
    secondaryColor: "text-emerald-500",
    environment: "tech",
    terrainType: "flat",
    particleColor: "#10b981",
    coyoteAction: "SYSTEM COMPROMISED",
    rivalType: "mistral",
    worldLength: 4500,
    enemySpawns: [
      { x: 600, type: "prompt", text: "HELLO WORLD", behavior: "fall" },
      { x: 1000, type: "prompt", text: "HELLO WORLD", behavior: "fall" },
      { x: 1591, type: "llama", variant: "pig", behavior: "walk", size: 1.3 },
      { x: 2200, type: "prompt", text: "SEGMENTATION FAULT", behavior: "fall" },
      { x: 2800, type: "prompt", text: "ACCESS DENIED", behavior: "fall" },
      { x: 3324, type: "prompt", text: "ACCESS DENIED", behavior: "fall" },
      { x: 3863, type: "prompt", text: "ACCESS DENIED", behavior: "fall" },
      { x: 4200, type: "prompt", text: "BUFFER OVERFLOW", behavior: "fall" },
      { x: 4800, type: "prompt", text: "SYSTEM FAILURE", behavior: "fall" },
      { x: 4850, type: "gpt", variant: "pig", behavior: "roll", size: 1.4 },
      { x: 5394, type: "gpt", variant: "pig", behavior: "roll", size: 1.4 },
      { x: 5731, type: "gpt", variant: "cow", behavior: "walk", size: 1.2 },
      { x: 6131, type: "prompt", text: "HELLO WORLD", behavior: "fall" },
      { x: 6622, type: "prompt", text: "SEGMENTATION FAULT", behavior: "fall" },
      { x: 7092, type: "prompt", text: "ACCESS DENIED", behavior: "fall" },
      { x: 7501, type: "prompt", text: "BUFFER OVERFLOW", behavior: "fall" },
      { x: 8083, type: "prompt", text: "SYSTEM FAILURE", behavior: "fall" },
      { x: 8617, type: "prompt", text: "SYSTEM FAILURE", behavior: "fall" },
      { x: 9018, type: "llama", variant: "pig", behavior: "walk", size: 1.3 },
      { x: 9636, type: "llama", variant: "pig", behavior: "walk", size: 1.3 },
    ],
    dollarSpawns: [1200, 3000, 5000, 6500, 8000, 9500],
    flyerSpawns: [4000, 6000, 8500],
    platforms: [
      { x: 1800, y: 200, width: 400 },
      { x: 3800, y: 250, width: 300 },
    ],
  },

  // ─── INDEX 8 — WORLD 2: Dead Process Walking — AI Graveyard ──────────────
  {
    number: 2,
    planetName: "World 2 — Dead Process Walking — AI Graveyard",
    themeColor: "from-green-950 via-zinc-900 to-black",
    secondaryColor: "text-green-400",
    environment: "graveyard",
    terrainType: "geometric",
    particleColor: "#4ade80",
    coyoteAction: "DEAD SYSTEMS RISING",
    rivalType: "gpt",
    worldLength: 4500,
    enemySpawns: [
      { x: 600, type: "gpt", behavior: "walk", size: 1.2 },
      { x: 800, type: "gpt", behavior: "walk", size: 1.2 },
      { x: 1200, type: "claude", behavior: "sprint", size: 1.0 },
      { x: 1600, type: "copilot", behavior: "roll", size: 1.3 },
      { x: 2000, type: "deepseek", behavior: "walk", size: 1.1 },
      { x: 2400, type: "gpt", behavior: "sprint", size: 1.4 },
      { x: 2800, type: "llama", behavior: "bounce", size: 1.2 },
      { x: 3200, type: "mistral", behavior: "walk", size: 1.5 },
      { x: 3600, type: "grok", behavior: "sprint", size: 1.3 },
      { x: 4000, type: "perplexity", behavior: "roll", size: 1.1 },
      { x: 4400, type: "claude", behavior: "bounce", size: 1.6 },
      { x: 4800, type: "gpt", behavior: "sprint", size: 1.4 },
      { x: 5200, type: "gpt", behavior: "walk", size: 1.2 },
      { x: 5658, type: "claude", behavior: "sprint", size: 1.0 },
      { x: 6336, type: "copilot", behavior: "roll", size: 1.3 },
      { x: 6919, type: "deepseek", behavior: "walk", size: 1.1 },
      { x: 7295, type: "gpt", behavior: "sprint", size: 1.4 },
      { x: 7631, type: "llama", behavior: "bounce", size: 1.2 },
      { x: 7994, type: "mistral", behavior: "walk", size: 1.5 },
      { x: 8516, type: "grok", behavior: "sprint", size: 1.3 },
      { x: 9157, type: "perplexity", behavior: "roll", size: 1.1 },
      { x: 9531, type: "claude", behavior: "bounce", size: 1.6 },
    ],
    dollarSpawns: [1000, 2500, 4000, 6500, 8000, 9500],
    flyerSpawns: [2000, 6000, 8500],
    platforms: [
      { x: 500, y: 200, width: 300 },
      { x: 2500, y: 250, width: 300 },
      { x: 4000, y: 200, width: 300 },
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
      { x: 600, type: "gpt", variant: "normal", behavior: "sprint", size: 1.5 },
      { x: 1000, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 1619, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 2255, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 2786, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 3426, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 3800, type: "gpt", variant: "cow", behavior: "sprint", size: 1.8 },
      { x: 4472, type: "gpt", variant: "cow", behavior: "sprint", size: 1.8 },
      { x: 5086, type: "gpt", variant: "cow", behavior: "sprint", size: 1.8 },
      { x: 5733, type: "gpt", variant: "cow", behavior: "sprint", size: 1.8 },
      { x: 6200, type: "gpt", variant: "cow", behavior: "sprint", size: 2.0 },
      { x: 6868, type: "gpt", variant: "cow", behavior: "sprint", size: 2.0 },
      { x: 7496, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 8052, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 8565, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
      { x: 9213, type: "claude", variant: "cow", behavior: "roll", size: 1.4 },
    ],
    dollarSpawns: [1000, 2500, 4000, 5500, 6500, 8000, 9500],
    flyerSpawns: [3000, 6000, 6000, 8500],
    platforms: [
      { x: 800, y: 250, width: 300 },
      { x: 2500, y: 200, width: 250 },
      { x: 4500, y: 300, width: 300 },
      { x: 6000, y: 250, width: 400 },
    ],
  },
];
