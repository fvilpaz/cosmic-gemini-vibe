import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');

let W9Regex = /(number: 9,[\s\S]*?enemySpawns: \[)([\s\S]*?)(\],[\s\S]*?dollarSpawns)/;
content = content.replace(W9Regex, (match, prefix, array, suffix) => {
    let replacedArray = array.replace(/variant: "cow"/g, 'variant: "normal"').replace(/variant: "sheep"/g, 'variant: "normal"');
    return prefix + replacedArray + suffix;
});

fs.writeFileSync('src/types.ts', content);
