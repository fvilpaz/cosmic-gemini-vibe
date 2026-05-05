import fs from 'fs';

const file = fs.readFileSync('src/types.ts', 'utf8');

// A function to find gaps in an array of x coords and inject new enemies
let result = '';
const spawnBlockRegex = /enemySpawns:\s*\[([\s\S]*?)\]/g;
let lastIndex = 0;
let match;
while ((match = spawnBlockRegex.exec(file)) !== null) {
  result += file.substring(lastIndex, match.index);
  const blockStart = match.index;
  const blockContent = match[1];
  
  const lines = blockContent.split('\n');
  let validLines = lines.filter(l => l.includes('{ x:'));
  
  if (validLines.length > 0) {
    // parse all x coords and lines
    let items = validLines.map(line => {
      let xMatch = line.match(/{\s*x:\s*(\d+)/);
      return {
        x: xMatch ? parseInt(xMatch[1]) : 0,
        line: line
      };
    });
    
    // sort them just in case
    items.sort((a,b) => a.x - b.x);
    
    let newItems = [];
    
    // Ensure early start
    if (items[0].x > 600) {
      let copy = items[0].line.replace(/{\s*x:\s*\d+/, `{ x: ${600}`);
      newItems.push({ x: 600, line: copy });
    }
    
    // Fill gaps
    for (let i = 0; i < items.length - 1; i++) {
      newItems.push(items[i]);
      let currentX = items[i].x;
      let nextX = items[i+1].x;
      while (nextX - currentX > 800) {
        currentX += 500 + Math.floor(Math.random() * 200);
        if (nextX - currentX > 300) {
          let copy = items[i].line.replace(/{\s*x:\s*\d+/, `{ x: ${currentX}`);
          newItems.push({ x: currentX, line: copy });
        }
      }
    }
    newItems.push(items[items.length - 1]);
    
    // Fill until 9500
    let lastX = newItems[newItems.length - 1].x;
    let fallbackLine = newItems[newItems.length - 1].line;
    while (lastX < 9200) {
      lastX += 500 + Math.floor(Math.random() * 200);
      let tLine = fallbackLine.replace(/{\s*x:\s*\d+/, `{ x: ${lastX}`);
      newItems.push({ x: lastX, line: tLine });
    }
    
    // reconstruct block
    let newBlock = 'enemySpawns: [\n';
    newItems.forEach((it, idx) => {
      newBlock += '    ' + it.line.trim().replace(/,$/, '');
      if (idx < newItems.length - 1) newBlock += ',\n';
      else newBlock += '\n';
    });
    newBlock += '  ]';
    result += newBlock;
  } else {
    result += match[0];
  }
  lastIndex = spawnBlockRegex.lastIndex;
}

result += file.substring(lastIndex);

fs.writeFileSync('src/types.ts', result);
console.log("Done fixing gaps.");
