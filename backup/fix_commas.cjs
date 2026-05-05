const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/enemySpawns: \[([\s\S]*?)\],/g, (match, spawns) => {
    let lines = spawns.split('\n');
    let fixedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim().startsWith('{')) {
            // ensure it ends with comma
            line = line.replace(/}[ \t]*,?[ \t]*$/, '}');
            line += ',';
        } else if (line.trim() === ',') {
            line = '';
        }
        if (line.trim() !== '') {
            fixedLines.push(line);
        }
    }
    // Remove last comma
    if (fixedLines.length > 0) {
        let lastNode = fixedLines[fixedLines.length - 1];
        if (lastNode.endsWith(',')) {
            fixedLines[fixedLines.length - 1] = lastNode.substring(0, lastNode.length - 1);
        }
    }
    
    return `enemySpawns: [\n${fixedLines.join('\n')}\n    ],`;
});

fs.writeFileSync('src/types.ts', code);
