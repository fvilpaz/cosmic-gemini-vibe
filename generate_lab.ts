import fs from 'fs';

const AIs = ['gpt', 'claude', 'copilot', 'deepseek', 'llama', 'grok', 'mistral', 'perplexity'];

let spawns = [];
spawns.push(`{ x: 600, type: 'gpt', variant: 'professor', behavior: 'walk', size: 1.0 }`); // Trigger for the boss
let currentX = 800;
while (currentX <= 9500) {
    let type = AIs[Math.floor(Math.random() * AIs.length)];
    let behavior = Math.random() > 0.5 ? 'walk' : 'sprint';
    let size = (1.0 + Math.random() * 0.8).toFixed(1);
    spawns.push(`{ x: ${Math.floor(currentX)}, type: '${type}', behavior: '${behavior}', size: ${size} }`);
    currentX += Math.random() * 400 + 400; // Average distance 600, meaning around 15 enemies. Wait, maybe less distance for dense enemies.
}

let result = `  {
    number: 10,
    planetName: "World 10 — THE FINAL LABORATORY",
    themeColor: "from-blue-950 via-sky-900 to-black",
    secondaryColor: "text-blue-300",
    environment: "lab",
    terrainType: "flat",
    particleColor: "#3b82f6",
    coyoteAction: "SYNTHESIS IN PROGRESS",
    rivalType: "gpt",
    worldLength: 10000,
    enemySpawns: [\n      ${spawns.join(',\n      ')}\n    ],
    dollarSpawns: [1500, 3000, 4500, 6000, 7500, 9000],
    flyerSpawns: [2500, 5000, 7500],
    platforms: [
      { x: 1000, y: 150, width: 200 },
      { x: 2500, y: 200, width: 250 },
      { x: 4500, y: 300, width: 300 },
      { x: 6500, y: 250, width: 350 },
      { x: 8000, y: 200, width: 200 }
    ],
  }`;

console.log(result);
