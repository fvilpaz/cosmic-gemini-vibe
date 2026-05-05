import fs from 'fs';

let content = fs.readFileSync('src/components/LevelBackground.tsx', 'utf8');

const cyberBlock = `  if (level.environment === 'cyberpunk') {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={level.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[#060611] overflow-hidden pointer-events-none"
        >
          {/* Cyberpunk grid sky overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 opacity-20 pointer-events-none" />

          {/* MATRIX LETTERS (Restored from tech) */}
          <div className="absolute inset-0 opacity-40 z-0">
          {[...Array(30)].map((_, i) => (
             <motion.div
                key={\`matrix-\${i}\`}
                className="absolute font-mono text-emerald-500 text-sm overflow-hidden font-bold leading-none tracking-widest break-all"
                style={{
                  top: 0,
                  left: \`\${Math.random() * 100}%\`,
                  width: "20px",
                  height: "100%",
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                  textShadow: "0 0 5px #10b981"
                }}
                animate={{ opacity: [0, 0.8, 0], y: ["-10%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 4,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                {"01<>/"
                  .repeat(15)
                  .split("")
                  .sort(() => Math.random() - 0.5)
                  .join("")}
              </motion.div>
          ))}
          </div>

          {/* Far Skyline (Depth 0.05) */}
          <div ref={el => { if (el) parallaxNodesRef.current[0] = el; }} data-depth="0.05" className="absolute bottom-[100px] w-[2000vw] h-[40vh] flex items-end will-change-transform z-10">
            {[...Array(100)].map((_, i) => {
               const isTall = i % 5 === 0;
               return (
                 <div key={\`b1-\${i}\`} className="relative flex-shrink-0 bg-[#0e0f1f] border-t border-l border-r border-[#1a1c36] shadow-[0_0_15px_rgba(139,92,246,0.1)_inset]" style={{ width: \`\${100 + Math.random() * 80}px\`, height: \`\${Math.random() * 100 + (isTall ? 200 : 50)}px\` }}>
                    {/* Neon windows */}
                    {[...Array(Math.floor(Math.random() * 5))].map((_, j) => (
                      <div key={j} className="absolute bg-fuchsia-600/30 w-full h-1" style={{ top: \`\${20 + j * 30}px\` }} />
                    ))}
                    {i % 7 === 0 && <div className="absolute top-0 right-2 w-1 h-8 bg-cyan-500/50 -translate-y-full" />}
                 </div>
               );
            })}
          </div>

          {/* Mid Skyline (Depth 0.15) */}
          <div ref={el => { if (el) parallaxNodesRef.current[1] = el; }} data-depth="0.15" className="absolute bottom-[80px] w-[1500vw] h-[30vh] flex items-end will-change-transform z-20">
             {[...Array(80)].map((_, i) => (
                <div key={\`b2-\${i}\`} className="relative flex-shrink-0 bg-[#121327] border-t border-[#312e81]" style={{ width: \`\${150 + Math.random() * 100}px\`, height: \`\${Math.random() * 150 + 80}px\` }}>
                   {i % 4 === 0 && <div className="absolute top-2 left-2 w-10 h-4 border border-cyan-400 bg-cyan-900/50 shadow-[0_0_10px_#22d3ee]" />}
                   {i % 5 === 0 && <div className="absolute top-10 right-0 w-20 h-6 border-y border-pink-500 bg-pink-900/40 shadow-[0_0_10px_#ec4899]" />}
                </div>
             ))}
          </div>

          {/* Near Balconies & Rooftops with Humans (Depth 0.4) - closer to action */}
          <div ref={el => { if (el) parallaxNodesRef.current[2] = el; }} data-depth="0.4" className="absolute bottom-[80px] w-[1000vw] h-[35vh] flex items-end will-change-transform z-30">
              {[...Array(50)].map((_, i) => (
                 <div key={\`b3-\${i}\`} className="relative flex-shrink-0 bg-[#181a33] border-t border-indigo-700 shadow-[0_-5px_15px_rgba(79,70,229,0.2)]" style={{ width: \`\${250 + Math.random() * 150}px\`, height: \`\${50 + Math.random() * 100}px\`, marginRight: \`\${Math.random() * 200 + 100}px\` }}>
                     {/* Rooftop Details */}
                     <div className="absolute top-0 inset-x-0 h-2 bg-indigo-900/50 border-b border-indigo-500/30" />
                     {i % 2 === 0 && <div className="absolute bottom-10 left-10 w-10 h-16 bg-slate-800 border border-slate-600 rounded-t-sm"><div className="w-full h-2 bg-red-500/30 mt-2" /></div>}

                     {/* Humans running on rooftop */}
                     {i % 3 === 0 && (
                        <motion.div 
                           className="absolute -top-6 left-0 flex gap-2"
                           animate={{ x: [0, 500] }}
                           transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: "linear" }}
                        >
                           {/* Human 1 (Male) */}
                           <div className="w-3 h-8 flex flex-col items-center">
                              <div className="w-2.5 h-2.5 bg-[#fcd34d] rounded-full" />
                              <motion.div 
                                className="w-2 h-4 bg-sky-600 rounded-sm"
                                animate={{ rotate: [-20, 20] }}
                                transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
                              />
                              <div className="flex gap-[1px]">
                                 <motion.div className="w-1 h-3 bg-stone-700" animate={{ rotate: [-30, 30] }} transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }} />
                                 <motion.div className="w-1 h-3 bg-stone-700" animate={{ rotate: [30, -30] }} transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }} />
                              </div>
                           </div>
                           
                           {/* Human 2 (Female) */}
                           <div className="w-3 h-7 flex flex-col items-center mt-1">
                              <div className="w-2.5 h-2.5 bg-[#fca5a5] rounded-full relative">
                                  {/* Hair */}
                                  <div className="absolute -top-0.5 -right-1 w-3 h-3 bg-amber-700 rounded-full" />
                              </div>
                              <motion.div 
                                className="w-2 h-3.5 bg-fuchsia-500 rounded-sm"
                                animate={{ rotate: [-20, 20] }}
                                transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
                              />
                              <div className="flex gap-[1px]">
                                 <motion.div className="w-1 h-2.5 bg-stone-800" animate={{ rotate: [-30, 30] }} transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }} />
                                 <motion.div className="w-1 h-2.5 bg-stone-800" animate={{ rotate: [30, -30] }} transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }} />
                              </div>
                           </div>
                           
                           {/* Exclamation marks of fear */}
                           <motion.div 
                              className="absolute -top-4 -right-2 text-red-500 font-bold text-[8px]"
                              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                              transition={{ repeat: Infinity, duration: 0.5 }}
                           >!</motion.div>
                        </motion.div>
                     )}
                 </div>
              ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[100px] landscape:h-[60px] overflow-hidden bg-gradient-to-t from-[#020617] to-[#1e1b4b]">
            <div ref={floorRef} className="flex will-change-transform" style={{ transform: \`translateX(0px)\`, width: 'calc(128px * 64)' }}>
              {[...Array(64)].map((_, i) => (
                <div
                  key={\`cfloor-\${i}\`}
                  className="flex-shrink-0 relative border-t-[3px] border-fuchsia-600/80 bg-[#0f172a] shadow-[0_0_20px_rgba(217,70,239,0.5)_inset]"
                  style={{ width: '128px', height: '100%' }}
                >
                  {/* Neon Grid on floor */}
                  <div className="absolute inset-x-0 top-2 h-px bg-cyan-500/30" />
                  <div className="absolute inset-x-0 top-6 h-px bg-cyan-500/20" />
                  <div className="absolute top-0 bottom-0 left-[64px] w-px bg-cyan-500/30" />
                </div>
              ))}
            </div>
            {/* Edge glow */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-fuchsia-600/20 to-transparent" />
          </div>

          {/* Flying cars in background */}
          {[...Array(30)].map((_, i) => (
             <motion.div
               key={\`car-\${i}\`}
               className="absolute w-8 h-2.5 rounded-full blur-[1px] opacity-70"
               style={{
                  top: \`\${Math.random() * 40 + 10}%\`,
                  backgroundColor: i % 2 === 0 ? '#38bdf8' : '#fb7185',
                  boxShadow: i % 2 === 0 ? '0 0 10px #38bdf8' : '0 0 10px #fb7185'
               }}
               animate={{ x: i % 2 === 0 ? ['100vw', '-20vw'] : ['-20vw', '100vw'] }}
               transition={{ repeat: Infinity, duration: 3 + Math.random() * 8, ease: "linear", delay: Math.random() * 10 }}
             >
                <div className="absolute top-[1px] left-0 w-3 h-1.5 bg-white rounded-full opacity-80" />
             </motion.div>
          ))}

        </motion.div>
      </AnimatePresence>
    );
  }

`;

if (content.includes("if (level.environment === \"mad-fields\") {")) {
    content = content.replace("  if (level.environment === \"mad-fields\") {", cyberBlock + "  if (level.environment === \"mad-fields\") {");
    fs.writeFileSync('src/components/LevelBackground.tsx', content);
    console.log('patched cyber 2 with double quotes matcher');
} else {
    console.log('Could not find anchor text.');
}
