import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("const [hasFarmer, setHasFarmer] = useState(false);", "const [hasFarmer, setHasFarmer] = useState(false);\n  const [hasProfessor, setProfessor] = useState(false);\n  const profPhaseRef = useRef('idle');\n  const [profPhase, setProfPhase] = useState('idle');\n  const profTimerRef = useRef(0);");

// Reset states
content = content.replace("setHasFarmer(hasF);", "setHasFarmer(hasF);\n    let hasP = level.enemySpawns.some(s => s.variant === 'professor');\n    setProfessor(hasP);\n    profTimerRef.current = 0;\n    profPhaseRef.current = 'idle';");

// Add global throw logic
const profLogic = `
    const _prevProfPhase = profPhaseRef.current;
    if (currentLevelRef.current?.enemySpawns?.some(s => s.variant === 'professor')) {
      profTimerRef.current += timeScale;
      const pt = profTimerRef.current;
      if (pt >= 60 && pt < 110) {
        profPhaseRef.current = 'throwing';
      } else if (pt >= 110 && pt < 120) {
        if (pt >= 110 && (pt - timeScale) < 110) {
          const variants = ['flask', 'wrench', 'gadget'];
          const throwCamX = Math.max(0, nX - (isL ? 1200 : window.innerWidth) / 3);
          const baseX = throwCamX + window.innerWidth - 100;
          const baseY = -160;

          enemiesRef.current.push({
            id: \`thrown-\${Date.now()}-2\`,
            type: 'gpt', 
            variant: variants[Math.floor(Math.random() * variants.length)] as any,
            behavior: 'thrown',
            x: baseX,
            y: baseY,
            size: 1.4,
            health: 1,
            isDead: false,
            phase: 0
          });
          setEnemies([...enemiesRef.current]);
        }
      } else if (pt >= 120) {
        profTimerRef.current = 0;
        profPhaseRef.current = 'idle';
      } else {
        profPhaseRef.current = 'idle';
      }
    }
    if (profPhaseRef.current !== _prevProfPhase) setProfPhase(profPhaseRef.current);
`;

content = content.replace("if (farmerPhaseRef.current !== _prevFarmerPhase) setFarmerPhase(farmerPhaseRef.current);", "if (farmerPhaseRef.current !== _prevFarmerPhase) setFarmerPhase(farmerPhaseRef.current);\n" + profLogic);

// Add condition for ignoring rendering logic
content = content.replace(/enemy\.variant \!\=\= 'farmer'/g, "enemy.variant !== 'farmer' && enemy.variant !== 'professor'");

content = content.replace("if (intersectX && intersectY && !isFlyingRef.current && !deathSequenceRef.current && !isHitRef.current && e.variant !== 'farmer') {", "if (intersectX && intersectY && !isFlyingRef.current && !deathSequenceRef.current && !isHitRef.current && e.variant !== 'farmer' && e.variant !== 'professor') {");

// Add Professor overlay code
const profOverlay = `
        {/* Professor Boss Overlay */}
        {currentLevel && hasProfessor && gameState === 'playing' && (
          <div className="fixed bottom-[120px] landscape:bottom-[70px] right-16 pointer-events-none z-[150]">
            <div className="flex justify-center mb-1">
              <div className={\`text-white text-[8px] px-2 py-0.5 rounded font-black uppercase border border-blue-400 \${profPhase === 'throwing' ? 'bg-red-700' : 'bg-blue-700/90'}\`}>
                {profPhase === 'throwing' ? 'TESTING!' : 'MAD PROFESSOR'}
              </div>
            </div>
            <div className="relative flex items-end" style={{ transform: 'scale(1.5)', transformOrigin: 'bottom right' }}>
              <div className="absolute z-10" style={{ right: '0px', bottom: '0px' }}>
                <motion.div
                  animate={profPhase === 'throwing' ? {
                    rotate: [0, -20, 15, 0],
                    y: [0, -6, -1, 0],
                  } : {
                    y: [0, -2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: profPhase === 'throwing' ? 0.3 : 2.5 }}
                  className="drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                >
                  <Competitor
                    type="gpt"
                    variant="professor"
                    action={profPhase === 'throwing' ? 'throwing' : 'idle'}
                    isMoving={false}
                  />
                </motion.div>
              </div>

              {/* Lab Console */}
              <div className="relative flex-shrink-0" style={{ width: '60px', height: '50px', marginLeft: '30px' }}>
                <div className="absolute inset-0 bg-slate-800 border-2 border-slate-600 rounded-t-md" />
                {/* Screen */}
                <div className="absolute top-2 left-2 right-2 h-14 bg-blue-900 border border-blue-400 rounded-sm overflow-hidden flex items-center justify-center">
                  <motion.div 
                    className="w-full h-1 bg-blue-400 opacity-50"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </div>

              {/* Throw flash */}
              {profPhase === 'throwing' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.85, 0], scale: [0.5, 2.5, 0.5] }}
                  transition={{ duration: 0.28, repeat: Infinity }}
                  className="absolute rounded-full blur-lg"
                  style={{ right: '40px', bottom: '40px', width: '38px', height: '38px', background: 'rgba(52,211,153,0.7)' }}
                />
              )}
            </div>
          </div>
        )}
`;

content = content.replace("{/* World 5: Meteor Shower Crash Overlay */}", profOverlay + "\n\n        {/* World 5: Meteor Shower Crash Overlay */}");

fs.writeFileSync('src/App.tsx', content);
console.log("patched app");
