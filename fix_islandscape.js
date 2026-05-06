import fs from 'fs';

let content = fs.readFileSync('./src/App.tsx', 'utf8');

// replace without parentheses
content = content.replace(/isLandscape \? 70 : 120/g, '120');

// Replace any remaining weird ones if any
content = content.replace(/isLandscape \? \(1\.3\) : 1\.7/, '1.7');

fs.writeFileSync('./src/App.tsx', content);
console.log("Fixed remaining isLandscape ternary logic");
