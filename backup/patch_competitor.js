import fs from 'fs';

let content = fs.readFileSync('src/components/Competitor.tsx', 'utf8');

// Insert names
content = content.replace("if (variant === 'native_rider') return \`\${baseName} RIDER\`;", "if (variant === 'native_rider') return \`\${baseName} RIDER\`;\n    if (variant === 'flask') return 'ACID FLASK';\n    if (variant === 'wrench') return 'PLASMA WRENCH';\n    if (variant === 'gadget') return 'GLITCH GADGET';\n    if (variant === 'professor') return 'MAD PROFESSOR';");

// Insert gradient colors
content = content.replace("if (variant === 'cow' || variant === 'sheep'", "if (variant === 'professor') return 'from-stone-300 via-stone-400 to-white border-blue-500 shadow-blue-500/20';\n    if (variant === 'flask') return 'from-green-400 to-lime-600 border-green-800 shadow-green-500/80 rounded-t-full rounded-b-none';\n    if (variant === 'wrench') return 'from-zinc-400 to-slate-700 border-zinc-900 shadow-zinc-500/40';\n    if (variant === 'gadget') return 'from-fuchsia-500 to-pink-700 border-fuchsia-200 shadow-fuchsia-500/80';\n    if (variant === 'cow' || variant === 'sheep'");

// Insert the professor rendering below farmer
const profBlock = `  if (variant === 'professor') {
    return (
      <div className="relative w-12 h-14 flex flex-col items-center">
        <motion.div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50 delay-100"
          animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="bg-blue-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic mb-0.5 border border-white/20 uppercase">DR. {getName()}</div>
        </motion.div>

        {/* Head */}
        <motion.div 
          className="relative w-8 h-8 rounded-full border-2 border-black bg-stone-300 flex items-center justify-center z-20 overflow-visible"
          animate={isMoving ? { y: [0, -2, 0], rotate: [-5, 5, -5] } : {}}
          transition={{ repeat: Infinity, duration: 0.3 }}
        >
          {/* Hair */}
          <div className="absolute -left-3 top-2 w-4 h-4 bg-white rounded-full blur-[2px]" />
          <div className="absolute -right-3 top-2 w-4 h-4 bg-white rounded-full blur-[2px]" />
          <div className="absolute -top-3 w-8 h-4 bg-white rounded-t-full blur-[2px]" />

          {/* Goggles */}
          <div className="absolute top-2 inset-x-0 h-4 flex items-center justify-center gap-0.5">
             <div className="w-3 h-3 border-2 border-slate-700 bg-emerald-400 rounded-full" />
             <div className="w-3 h-3 border-2 border-slate-700 bg-emerald-400 rounded-full" />
          </div>

          <div className="absolute bottom-1 w-3 h-1.5 bg-black rounded-b-full transition-transform" style={{ transform: action === 'throwing' ? 'scaleY(2)' : 'scaleY(1)' }} />
        </motion.div>

        {/* Body */}
        <motion.div 
          className="relative w-7 h-6 bg-white border border-blue-900 rounded-sm flex justify-center -mt-1 z-10"
          animate={isMoving ? { y: [0, 1, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.1 }}
        >
          {/* Lab Coat */}
          <div className="absolute inset-x-0 h-8 bg-white border-l border-r border-blue-900 -z-10" />
          
          <div className="absolute top-0 inset-x-0 h-6 bg-stone-200 -z-20" />

          {/* Arms with Throwing effect */}
          <motion.div 
            className={\`absolute top-1 w-1.5 h-6 bg-stone-300 border border-blue-900 rounded-full origin-top -left-2\`}
            animate={action === 'throwing' ? { rotate: [120, -60] } : isMoving ? { rotate: [80, -20] } : { rotate: 20 }}
            transition={action === 'throwing' ? { duration: 0.5 } : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }}
          />
          <motion.div 
             className={\`absolute top-1 w-1.5 h-6 bg-stone-300 border border-blue-900 rounded-full origin-top -right-2 flex flex-col items-center justify-end z-20\`}
             animate={action === 'throwing' ? { rotate: [120, -60] } : isMoving ? { rotate: [-100, -20] } : { rotate: -20 }}
             transition={action === 'throwing' ? { duration: 0.5 } : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }}
          >
             <div className="w-2 h-3 bg-emerald-500 rounded-t-sm rounded-b-xl border border-emerald-900 shadow-[0_0_8px_#34d399] -mb-2" />
          </motion.div>
        </motion.div>

        {/* Legs */}
        <div className="flex gap-1 -mt-1 z-0">
          <motion.div 
            className="w-1.5 h-4 bg-blue-900 border border-black rounded-b-sm origin-top"
            animate={isMoving ? { rotate: [-30, 30] } : {}}
            transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
          />
          <motion.div 
            className="w-1.5 h-4 bg-blue-900 border border-black rounded-b-sm origin-top"
            animate={isMoving ? { rotate: [30, -30] } : {}}
            transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
          />
        </div>
      </div>
    );
  }

  // RENDERING TOOLS
  if (variant === 'flask') {
     return (
       <div className="relative w-8 h-10 flex flex-col items-center">
         <div className="w-3 h-4 bg-zinc-200 border-2 border-zinc-500 rounded-t-sm" />
         <div className="w-7 h-6 bg-emerald-500 border-2 border-emerald-700 rounded-b-xl font-mono text-[8px] text-emerald-900 flex items-center justify-center font-black shadow-[0_0_15px_#10b981]" >
           H+
         </div>
       </div>
     );
  }
  if (variant === 'wrench') {
     return (
       <div className="relative w-4 h-12 flex flex-col items-center justify-between bg-zinc-400 border border-zinc-700 rounded-sm">
         <div className="w-6 h-5 border-[3px] border-zinc-700 rounded-t-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
         <div className="w-6 h-5 border-[3px] border-zinc-700 rounded-b-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
       </div>
     );
  }
  if (variant === 'gadget') {
     return (
       <div className="relative w-8 h-8 flex flex-col items-center justify-center bg-zinc-800 border-2 border-fuchsia-500 rounded-lg shadow-[0_0_10px_#ec4899] overflow-hidden">
         <motion.div 
           className="w-full h-1 bg-fuchsia-500"
           animate={{ y: [-4, 4, -4] }}
           transition={{ repeat: Infinity, duration: 0.4 }}
         />
         <div className="text-[6px] font-mono text-fuchsia-300 font-bold mt-1">ERR</div>
       </div>
     );
  }
`;

content = content.replace("  if (variant === 'timer') {", profBlock + "\n\n  if (variant === 'timer') {");

fs.writeFileSync('src/components/Competitor.tsx', content);
console.log("patched competitor");
