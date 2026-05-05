import fs from 'fs';

let content = fs.readFileSync('src/components/LevelBackground.tsx', 'utf8');

const regexToMatch = /if \(level\.environment === "mad-fields"\) \{\n\s*floorRef\.current\.style\.transform/;
if (content.match(regexToMatch)) {
   content = content.replace(regexToMatch, `if (level.environment === "cyberpunk") {
          floorRef.current.style.transform = \`translateX(\${-(Math.floor(sx) % 128)}px)\`;
        } else if (level.environment === "mad-fields") {
          floorRef.current.style.transform`);
   fs.writeFileSync('src/components/LevelBackground.tsx', content);
   console.log('Successfully injected cyberpunk block before mad-fields useeffect block!');
} else {
   console.log('Regex failed to find mad-fields useeffect block');
}
