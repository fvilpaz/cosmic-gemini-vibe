const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/worldLength: ([\d]+),\s*enemySpawns: \[([\s\S]*?)\],/g, (match, wl, spawns) => {
    let length = parseInt(wl);
    let originalSpawnsStr = spawns.trim();
    let lines = originalSpawnsStr.split('\n');
    let keptLines = [];
    for(let line of lines) {
        if (!line.trim()) continue;
        let isFarmer = line.includes('farmer');
        let isPrompt = line.includes('prompt');
        // Drop 30% if not farmer and not prompt
        if (!isFarmer && !isPrompt && Math.random() < 0.30) {
            continue; 
        }
        if (isFarmer) {
           line = line.replace(/behavior: '[^']+'+/, "behavior: 'walk'"); 
        }
        keptLines.push(line);
    }
    let result = keptLines.join('\n');
    if (result.endsWith(',')) result = result.substring(0, result.length - 1);
    
    return `worldLength: ${length},\n    enemySpawns: [\n${result}\n    ],`;
});
fs.writeFileSync('src/types.ts', code);
