import fs from 'fs';

let content = fs.readFileSync('./src/types.ts', 'utf8');

const oldWorld1Regex = /planetName: "World 1 — THE FINAL SYNC — Google I\/O 2026",[\s\S]*?enemySpawns: \[[\s\S]*?\],[\s\S]*?dollarSpawns/g;

const newWorld1 = `planetName: "World 1 — THE FINAL SYNC — Google I/O 2026",
    themeColor: "from-violet-950 via-fuchsia-900 to-black",
    secondaryColor: "text-fuchsia-300",
    environment: "void",
    terrainType: "geometric",
    particleColor: "#d946ef",
    coyoteAction: "FINAL SYNC INITIATED",
    rivalType: "gpt",
    worldLength: 3000,
    enemySpawns: [
      { x: 500, type: "gpt", behavior: "idle", size: 1.5 },
      { x: 800, type: "claude", behavior: "idle", size: 1.4 },
      { x: 1100, type: "copilot", behavior: "idle", size: 1.3 },
      { x: 1400, type: "deepseek", behavior: "idle", size: 1.4 },
      { x: 1700, type: "mistral", behavior: "idle", size: 1.3 },
      { x: 2000, type: "llama", behavior: "idle", size: 1.5 },
      { x: 2300, type: "grok", behavior: "idle", size: 1.6 },
      { x: 2600, type: "perplexity", behavior: "idle", size: 1.4 },
    ],
    dollarSpawns`;

content = content.replace(oldWorld1Regex, newWorld1);

fs.writeFileSync('./src/types.ts', content);
console.log("Updated World 1 spawns to be friendly AI gathering");
