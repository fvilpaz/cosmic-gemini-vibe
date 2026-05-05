import fs from 'fs';

let content = fs.readFileSync('src/components/LevelBackground.tsx', 'utf8');

const regex = /if \(level\.environment === 'cyberpunk'\) \{[\s\S]*?\}\n\n  if \(level\.environment === "mad-fields"\) \{/;

if (content.match(regex)) {
   content = content.replace(regex, 'if (level.environment === "mad-fields") {');
   fs.writeFileSync('src/components/LevelBackground.tsx', content);
   console.log("Restored first occurrence");
} else {
   console.log("No match first");
}

let content2 = fs.readFileSync('src/components/LevelBackground.tsx', 'utf8');

const renderRegex = /\}\s*\n\s*if \(level\.environment === "mad-fields"\) \{\n\s*return \(\n\s*<AnimatePresence/;
if (content2.match(renderRegex)) {
   // This is the correct place to insert it. We should load patch_cyberpunk2 content.
   console.log("Found second match correctly.");
} else {
   console.log("Cannot find render block.");
}
