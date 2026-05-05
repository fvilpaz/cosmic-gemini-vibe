import fs from 'fs';

const file = fs.readFileSync('src/types.ts', 'utf8');

// replace the block for World 10
let newFile = file.replace(/{\s*number: 10,[\s\S]*?(},\s*{|}\s*\]\s*;)/, (match, p1) => {
    let output = fs.readFileSync('lab_output.txt', 'utf8');
    // determine what ends it
    if (p1.includes(']')) {
        return output.trim() + '\n];\n';
    } else {
        return output.trim() + ',\n  {';
    }
});

fs.writeFileSync('src/types.ts', newFile);
console.log("types replaced");
