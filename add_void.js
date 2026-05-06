import fs from 'fs';

let content = fs.readFileSync('./src/components/LevelBackground.tsx', 'utf8');

// The file has a structured approach, at the end it returns for generic ones. But wait, I'll just check if it's "void" near the top and return a special celebration background right away.
const importStatement = `import React, { useEffect, useRef, useState } from "react";`;
content = content.replace(`import React, { useEffect, useRef } from "react";`, importStatement);

const voidComponent = `
  if (level.environment === 'void') {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 overflow-hidden pointer-events-none z-[0] bg-black"
        >
          {/\* Night sky gradient \*/}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900/40 to-black z-0 pointer-events-none" />

          {/\* Fireworks \*/}
          {[...Array(20)].map((_, i) => {
            const h = [200, 300, 150, 400, 250, 350, 450, 100, 500, 320, 280, 180, 420, 380, 220, 120, 480, 310, 290, 210][i];
            const w = [10, 80, 40, 20, 90, 50, 70, 30, 60, 15, 85, 45, 25, 95, 55, 75, 35, 65, 5, 100][i];
            const delay = [0, 1.2, 0.5, 2.1, 0.8, 1.5, 2.8, 0.3, 2.5, 1.0, 0.6, 2.0, 1.1, 2.4, 0.4, 1.8, 0.9, 2.7, 0.7, 1.3][i];
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
            return (
              <motion.div
                key={\`firework-\${i}\`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: \`\${h}px\`,
                  left: \`\${w}vw\`,
                  boxShadow: \`0 0 10px \${colors[i % 7]}, 0 0 20px \${colors[i % 7]}, 0 0 40px \${colors[i % 7]}, 0 0 80px \${colors[i % 7]}\`,
                  backgroundColor: colors[i % 7],
                }}
                animate={{
                  scale: [0, Math.random() * 5 + 5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeOut"
                }}
              />
            );
          })}

          {/\* Confetti falling \*/}
          {[...Array(50)].map((_, i) => {
            const w = (i * 7) % 100;
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
            return (
              <motion.div
                key={\`confetti-\${i}\`}
                className="absolute w-2 h-4"
                style={{
                  left: \`\${w}vw\`,
                  backgroundColor: colors[i % 7],
                }}
                animate={{
                  y: ["-20vh", "120vh"],
                  rotateZ: [0, 360],
                  rotateY: [0, 360]
                }}
                transition={{
                  duration: 5 + (i % 5),
                  repeat: Infinity,
                  delay: (i * 0.2) % 5,
                  ease: "linear"
                }}
              />
            );
          })}

          {/\* Crowd / Humans Silhouette vector \*/}
          <div className="absolute bottom-[100px] left-0 w-full h-32 flex justify-between items-end px-10 opacity-70 z-10 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={\`human-\${i}\`}
                className="text-white text-5xl"
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 0.5 + (i % 3) * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i * 0.1) % 0.5,
                }}
              >
                🙌
              </motion.div>
            ))}
          </div>

          {/\* Huge Text "I/O 2026 COUNTDOWN" *\/}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] pointer-events-none">
             <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, type: "spring", bounce: 0.5 }}
                className="text-white/40 text-[20vw] font-black leading-none italic mix-blend-overlay"
                style={{ textShadow: "0 0 100px rgba(255,255,255,0.5)" }}
             >
                1
             </motion.div>
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 1 }}
                className="text-white text-3xl md:text-5xl font-mono tracking-[0.5em] mt-8 font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
             >
                I/O 2026 COUNTDOWN
             </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
`;

content = content.replace(/if\s*\(level\.environment\s*===\s*'cyberpunk'\)\s*\{/, voidComponent + "\n  if (level.environment === 'cyberpunk') {");

fs.writeFileSync('./src/components/LevelBackground.tsx', content);
console.log("Added void (World 1) to LevelBackground.tsx");
