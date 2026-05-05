import fs from 'fs';

let content = fs.readFileSync('src/components/Competitor.tsx', 'utf8');

const regex = /if \(variant === "target"\) \{/;

const newProf = `  if (variant === 'professor') {
    return (
      <div className="relative w-16 h-16 flex flex-col items-center">
        <motion.div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50 delay-100"
          animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="bg-blue-600 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-black italic mb-0.5 border border-white/20 uppercase">DR. {getName()}</div>
        </motion.div>

        {/* Head */}
        <motion.div 
          className="absolute top-0 right-1 w-10 h-10 rounded-[40%_60%_70%_30%] border-2 border-black bg-stone-100 flex items-center justify-center z-30"
          animate={isMoving ? { y: [0, -2, 0], rotate: [-10, 10, -10] } : {}}
          transition={{ repeat: Infinity, duration: 0.3 }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {/* Crazy white hair - electric spiky */}
          <div className="absolute -left-4 -top-2 w-6 h-6 border-t-4 border-l-4 border-gray-300 rounded-tr-full -rotate-45" />
          <div className="absolute -right-4 -top-0 w-6 h-6 border-t-4 border-r-4 border-gray-300 rounded-tl-full rotate-45" />
          <div className="absolute -top-4 w-6 h-8 border-t-4 border-l-4 border-gray-300 rounded-tr-full -rotate-12" />
          <div className="absolute -top-3 w-5 h-6 border-t-4 border-r-4 border-gray-300 rounded-tl-full rotate-[30deg]" />

          {/* Goggles on forehead */}
          <div className="absolute -top-2 inset-x-0 h-4 flex items-center justify-center gap-[1px]">
             <div className="w-4 h-4 border-2 border-slate-800 bg-emerald-400 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px]" />
             </div>
             <div className="w-4 h-4 border-2 border-slate-800 bg-emerald-400 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px]" />
             </div>
          </div>
          <div className="absolute -top-1 left-0 right-0 h-1 bg-slate-800 -z-10" />

          {/* Big crazy eye */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-white border border-black rounded-full flex items-center justify-center transform rotate-12">
             <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          {/* Smaller crazy eye */}
          <div className="absolute top-3 left-6 w-2 h-2 bg-white border border-black rounded-full flex items-center justify-center">
             <div className="w-0.5 h-0.5 bg-black rounded-full" />
          </div>

          {/* Huge grin */}
          <div className="absolute bottom-1 left-3 w-6 h-3 bg-red-900 border border-black rounded-b-full overflow-hidden flex justify-between">
              {/* Teeth */}
              <div className="w-full h-1 bg-white mb-auto mt-0" />
              <div className="absolute bottom-0 w-full h-0.5 bg-white" />
          </div>
        </motion.div>

        {/* Hunched Body */}
        <motion.div 
          className="absolute top-6 right-2 w-10 h-8 bg-white border-2 border-black rounded-t-3xl rounded-bl-3xl flex justify-center z-20 overflow-hidden"
          animate={isMoving ? { y: [0, 1, 0], rotate: [-2, 2, -2] } : {}}
          transition={{ repeat: Infinity, duration: 0.15 }}
          style={{ transformOrigin: 'bottom right' }}
        >
          {/* Lab Coat Details */}
          <div className="absolute top-2 right-2 w-2 h-2 border-b-2 border-l-2 border-gray-400" />
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gray-200" />
          
          {/* Green splatter on coat */}
          <div className="absolute top-4 left-3 w-2 h-2 bg-lime-400 rounded-full blur-[1px]" />
          <div className="absolute top-6 left-5 w-1.5 h-1.5 bg-lime-400 border border-lime-600 rounded-full" />
        </motion.div>

        {/* Left Arm holding flask */}
        <motion.div 
          className="absolute top-8 left-0 w-8 h-3 bg-white border-2 border-black rounded-full origin-right z-30"
          animate={action === 'throwing' ? { rotate: [60, -90] } : isMoving ? { rotate: [10, -20] } : { rotate: 5 }}
          transition={action === 'throwing' ? { duration: 0.5 } : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }}
        >
           {/* Black Glove */}
           <div className="absolute -left-2 -top-1 w-4 h-5 bg-slate-800 border-2 border-black rounded-full flex items-center justify-center">
              {/* Flask */}
              <div className="absolute -top-6 w-4 h-6 bg-lime-400 border border-black rounded-b-md shadow-[0_0_10px_rgba(163,230,53,0.8)] flex flex-col items-center">
                 <div className="w-2 h-3 border-l border-r border-black" />
                 <div className="w-2 h-1 bg-slate-200 border-b border-black -mt-1" />
                 <div className="text-[4px] font-black mt-1 text-black">X</div>
              </div>
           </div>
        </motion.div>

        {/* Right Arm swinging back */}
        <motion.div 
           className="absolute top-8 right-2 w-8 h-3 bg-white border-2 border-black border-l-0 rounded-r-full z-10 origin-left flex justify-end items-center"
           animate={action === 'throwing' ? { rotate: [-100, 20] } : isMoving ? { rotate: [-40, -10] } : { rotate: -30 }}
           transition={action === 'throwing' ? { duration: 0.5 } : { repeat: Infinity, duration: 0.3, repeatType: "mirror" }}
        >
           {/* Glove */}
           <div className="absolute -right-1 -top-0.5 w-3 h-4 bg-slate-800 border-2 border-black rounded-full" />
        </motion.div>

        {/* Legs - very thin and crouched */}
        <div className="absolute bottom-0 right-4 flex gap-2 z-10 w-6 justify-between">
          <motion.div 
            className="w-1.5 h-4 bg-slate-800 border border-black origin-top rounded-b-sm"
            animate={isMoving ? { rotate: [-30, 40] } : {}}
            transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
          >
             <div className="absolute bottom-0 -right-1 w-4 h-2 bg-[#8B4513] border border-black rounded-r-full" />
          </motion.div>
          <motion.div 
            className="w-1.5 h-4 bg-slate-800 border border-black origin-top rounded-b-sm"
            animate={isMoving ? { rotate: [40, -30] } : {}}
            transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror", delay: 0.1 }}
          >
             <div className="absolute bottom-0 -right-1 w-4 h-2 bg-[#8B4513] border border-black rounded-r-full" />
          </motion.div>
        </div>
      </div>
    );
  }

  // RENDERING TOOLS
  if (variant === 'flask') {
     return (
       <div className="relative w-8 h-10 flex flex-col items-center drop-shadow-[0_0_15px_#10b981]">
         <div className="w-3 h-4 bg-zinc-200 border-2 border-zinc-500 rounded-t-sm" />
         <div className="w-7 h-6 bg-emerald-500 border-2 border-emerald-700 rounded-b-xl font-mono text-[8px] text-emerald-900 flex items-center justify-center font-black" >
           H+
         </div>
       </div>
     );
  }
  if (variant === 'wrench') {
     return (
       <div className="relative w-4 h-12 flex flex-col items-center justify-between bg-zinc-400 border border-zinc-700 rounded-sm drop-shadow-[0_0_10px_#22d3ee]">
         <div className="w-6 h-5 border-[3px] border-zinc-700 rounded-t-lg bg-cyan-400 rounded-b-sm" />
         <div className="w-6 h-5 border-[3px] border-zinc-700 rounded-b-lg bg-cyan-400 rounded-t-sm" />
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

  if (variant === "target") {`;

if (regex.test(content)) {
    content = content.replace(regex, newProf);
    fs.writeFileSync('src/components/Competitor.tsx', content);
    console.log("Updated mad professor completely!");
} else {
    console.log("Regex didn't match.");
}
