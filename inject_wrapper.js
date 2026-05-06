import fs from 'fs';

let content = fs.readFileSync('./src/App.tsx', 'utf8');

const regex = /(<main[\s\S]*?id="game-container"[\s\S]*?>)([\s\S]*?)(<\/main>)/;

const replacement = `$1
      <div 
        style={{
          transform: \`scale(var(--mobile-scale, 1))\`,
          transformOrigin: 'top left',
          width: \`calc(100% * var(--mobile-inv-scale, 1))\`,
          height: \`calc(100% * var(--mobile-inv-scale, 1))\`,
          position: 'relative'
        }}
      >
        $2
      </div>
$3`;

content = content.replace(regex, replacement);
fs.writeFileSync('./src/App.tsx', content);
console.log("Injected scale wrapper.");
