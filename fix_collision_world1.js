import fs from 'fs';

let content = fs.readFileSync('./src/App.tsx', 'utf8');

// Modify the enemy collision condition
const originalCondition = `      if (
        intersectX &&
        intersectY &&
        !isFlyingRef.current &&
        !deathSequenceRef.current &&
        !isHitRef.current &&
        e.variant !== "farmer" &&
        e.variant !== "professor"
      ) {`;

const newCondition = `      if (
        intersectX &&
        intersectY &&
        !isFlyingRef.current &&
        !deathSequenceRef.current &&
        !isHitRef.current &&
        e.variant !== "farmer" &&
        e.variant !== "professor" &&
        currentLevelRef.current?.number !== 1 // Celebration Level: No Hits!
      ) {`;

content = content.replace(originalCondition, newCondition);

// Let's add hearts to enemies in World 1!
const enemyRenderRegex = /<Competitor\s*type=\{enemy\.type\}/;
const heartInjection = `{currentIdx === 9 && !enemy.isDead && (
  <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center select-none pointer-events-none drop-shadow-[0_0_10px_rgba(255,0,100,0.8)]">
    <div className="text-3xl text-pink-500">❤️</div>
    {/* Optional: we can add human clapping emoji here too! */}
  </div>
)}
<Competitor
  type={enemy.type}`;

content = content.replace(enemyRenderRegex, heartInjection);

fs.writeFileSync('./src/App.tsx', content);
console.log("Updated App.tsx collision and hearts");
