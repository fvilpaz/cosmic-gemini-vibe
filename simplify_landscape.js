import fs from 'fs';

let content = fs.readFileSync('./src/App.tsx', 'utf8');

// 1. Strip all manual media query scales again (just in case)
content = content.replace(/ \[@media\(max-height:500px\)\]:[^\s"']+/g, '');

// 2. Remove all landscape: variants from classes
content = content.replace(/ landscape:[^\s"']+/g, '');

// 3. Replace `isLandscape ? 70 : 120` with `120` globally
content = content.replace(/\(isLandscape \? 70 : 120\)/g, '120');

// 4. In CSS strings or interpolation strings, replace it back if we screwed up, but it looks like we used it literally
content = content.replace(/isLandscape \? "80px" : "140px"/g, '"140px"');

// 5. Replace `isLandscape ? 0.85 : 0.95` with `0.95` (scale)
content = content.replace(/isLandscape \? 0\.85 : 0\.95/g, '0.95');

// 6. Replace `window.innerHeight < 500 ? 0.7 : 1.3` with `1.3` since our internal height is now > 500
content = content.replace(/window\.innerHeight < 500 \? 0\.7 : 1\.3/g, '1.3');

fs.writeFileSync('./src/App.tsx', content);
console.log("Restored internal physics values and removed tailwind landscape prefixes for perfect zooming");
