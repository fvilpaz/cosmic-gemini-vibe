import fs from 'fs';

let content = fs.readFileSync('./src/App.tsx', 'utf8');

// Farmer disable
content = content.replace(
  `some((s) => s.variant === "farmer")\n    ) {`,
  `some((s) => s.variant === "farmer") && currentLevelRef.current?.number !== 1\n    ) {`
);

// Professor disable
content = content.replace(
  `some(\n        (s) => s.variant === "professor",\n      )\n    ) {`,
  `some(\n        (s) => s.variant === "professor",\n      ) && currentLevelRef.current?.number !== 1\n    ) {`
);

fs.writeFileSync('./src/App.tsx', content);
console.log("Disabled throwing for celebration level.");
