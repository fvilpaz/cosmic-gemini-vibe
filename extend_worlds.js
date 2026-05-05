import fs from 'fs';

const file = fs.readFileSync('src/types.ts', 'utf8');

// replace worldLength: \d+, with worldLength: 10000,
let newFile = file.replace(/worldLength:\s*\d+,/g, 'worldLength: 10000,');

// for each enemySpawns array, if the last element is below 9000, add more elements by copying the existing ones with an offset
let result = '';
const spawnBlockRegex = /enemySpawns:\s*\[([\s\S]*?)\]/g;
let lastIndex = 0;
let match;
while ((match = spawnBlockRegex.exec(newFile)) !== null) {
  result += newFile.substring(lastIndex, match.index);
  const blockStart = match.index;
  const blockContent = match[1];
  
  // Extract x coords to find the max
  const lines = blockContent.split('\n');
  let validLines = lines.filter(l => l.includes('{ x:'));
  
  if (validLines.length > 0) {
    let lastLine = validLines[validLines.length - 1];
    let matchX = lastLine.match(/{\s*x:\s*(\d+)/);
    if (matchX) {
      let maxX = parseInt(matchX[1]);
      
      let extraLines = [];
      let offset = maxX + 400;
      let i = 0;
      
      // while we're under 9000
      while (offset < 9800) {
        // pick a line from existing
        let srcLine = validLines[i % validLines.length];
        // replace its x with offset
        let newLine = srcLine.replace(/{\s*x:\s*\d+/, `{ x: ${offset}`);
        extraLines.push(newLine);
        offset += Math.floor(Math.random() * 400 + 300); // 300-700 spacing
        i++;
      }
      
      if (extraLines.length > 0) {
        let replacement = match[0].replace(
          /(\r?\n\s*)*\]/, 
          ',\n' + extraLines.join(',\n') + '\n    ]'
        );
        result += replacement;
      } else {
        result += match[0];
      }
    } else {
       result += match[0];
    }
  } else {
    result += match[0];
  }
  lastIndex = spawnBlockRegex.lastIndex;
}

result += newFile.substring(lastIndex);

// Also expand dollarSpawns and flyerSpawns somewhat
result = result.replace(/dollarSpawns:\s*\[([^\]]*)\]/g, (m, p1) => {
   return `dollarSpawns: [${p1}, 6500, 8000, 9500]`;
});
result = result.replace(/flyerSpawns:\s*\[([^\]]*)\]/g, (m, p1) => {
   return `flyerSpawns: [${p1}, 6000, 8500]`;
});

fs.writeFileSync('src/types.ts', result);
console.log("types.ts extended to 10000!");
