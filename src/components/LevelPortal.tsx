import { motion } from "motion/react";

interface LevelPortalProps {
  currentLevelNumber: number;
  targetNumber: number;
}

export const LevelPortal = ({ currentLevelNumber, targetNumber }: LevelPortalProps) => {
  if (currentLevelNumber === 7) return null; // UFO Abduction

  switch (currentLevelNumber) {
    case 10: // Lab -> 9
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-64 border-x-8 border-t-8 border-gray-400 bg-gray-800 shadow-[0_0_50px_rgba(0,255,255,0.3)] overflow-hidden rounded-t-lg">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
            <motion.div
              className="absolute inset-0 bg-cyan-500/20"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-center justify-center">
              <span className="text-7xl font-black text-cyan-300 drop-shadow-[0_0_20px_cyan]">{targetNumber}</span>
            </div>
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gray-700/80 border-b-4 border-cyan-400 flex items-center justify-center">
               <span className="text-xs text-cyan-400 tracking-widest font-bold">ELEVATOR</span>
            </div>
          </div>
        </div>
      );

    case 9: // Cyberpunk -> 8
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-full border-8 border-pink-600 bg-black/80 shadow-[0_0_60px_rgba(236,72,153,0.6)] overflow-hidden flex items-center justify-center">
            {/* Cyberpunk tunnel grid */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 30%, #db2777 100%)' }} />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-pink-500 rounded-full"
                style={{ width: `${100 + i * 20}%`, height: `${100 + i * 20}%` }}
                animate={{ scale: [1, 0.1], opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              />
            ))}
            <span className="text-7xl font-black italic text-pink-400 drop-shadow-[0_0_30px_#ec4899] z-10">{targetNumber}</span>
          </div>
        </div>
      );

    case 8: // Mad Fields -> 7
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-64 border-x-[12px] border-t-[12px] border-[#5c4033] bg-orange-900/30 flex items-center justify-center">
            {/* Barn Door feel */}
            <div className="absolute inset-x-0 top-1/4 h-1 bg-[#5c4033] rotate-45 scale-150" />
            <div className="absolute inset-x-0 top-1/4 h-1 bg-[#5c4033] -rotate-45 scale-150" />
            <div className="absolute -top-16 bg-[#3e2723] px-6 py-2 border-4 border-[#2b1b17] transform rotate-[-5deg] shadow-lg">
               <span className="text-5xl font-serif font-black text-[#ffeb3b] drop-shadow-[0_0_15px_#ffeb3b]">{targetNumber}</span>
            </div>
            <motion.div className="w-20 h-20 bg-orange-500/40 rounded-full blur-xl" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} />
          </div>
        </div>
      );

    case 6: // Ship (Hangar) -> 5
      return (
        <div className="flex flex-col items-center">
          <div
            className="relative w-36 h-60 border-4 border-zinc-400 overflow-hidden shadow-[0_0_40px_rgba(74,222,128,0.6)]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, rgba(251,191,36,0.25) 0px, rgba(251,191,36,0.25) 6px, transparent 6px, transparent 18px)",
              backgroundColor: "#18181b",
            }}
          >
            <div
              className="absolute inset-3 rounded-sm overflow-hidden"
              style={{ background: "radial-gradient(ellipse at 50% 50%, #1e1b4b, #000)" }}
            >
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{ top: `${(i * 47) % 100}%`, left: `${(i * 63) % 100}%`, opacity: 0.8 }}
                />
              ))}
            </div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <span className="text-6xl font-black text-green-400" style={{ textShadow: "0 0 30px #4ade80, 0 0 60px #4ade80" }}>
                {targetNumber}
              </span>
            </motion.div>
            <div
              className="absolute bottom-0 inset-x-0 h-3 z-20"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 10px, #18181b 10px, #18181b 20px)" }}
            />
          </div>
        </div>
      );

    case 5: // Nebula -> 4
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Wormhole */}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-900/60 blur-xl"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              style={{ backgroundImage: "conic-gradient(from 0deg, #581c87, #c084fc, #581c87)" }}
            />
            <div className="absolute inset-8 rounded-full bg-black shadow-[inset_0_0_30px_#c084fc]" />
            <motion.div
              className="z-10"
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
               <span className="text-6xl font-black text-white drop-shadow-[0_0_20px_#e879f9]">{targetNumber}</span>
            </motion.div>
          </div>
        </div>
      );

    case 4: // Water -> 3
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-64 border-[10px] border-[#0c4a6e] rounded-[50px] bg-[#0284c7]/30 overflow-hidden flex items-center justify-center shadow-[0_0_50px_#0ea5e9]">
            {/* Bubble effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full border border-blue-200/50"
                style={{ left: `${(i * 15) % 100}%` }}
                animate={{ y: [300, -100], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2 + (i % 3), delay: i * 0.5 }}
              />
            ))}
            <span className="text-7xl font-sans font-black text-[#e0f2fe] drop-shadow-[0_0_25px_#38bdf8] z-10">{targetNumber}</span>
          </div>
        </div>
      );

    case 3: // Tech -> 2
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 rotate-45 border-8 border-lime-500 bg-black flex items-center justify-center shadow-[0_0_40px_rgba(132,204,22,0.8)]">
            <motion.div
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(132,204,22,0.2)_1px,transparent_1px)] bg-[length:100%_10px]"
              animate={{ y: [-10, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <div className="-rotate-45">
              <motion.span
                className="text-7xl font-mono font-black text-lime-400 drop-shadow-[0_h_15px_#a3e635]"
                animate={{ opacity: [1, 0.8, 1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {targetNumber}
              </motion.span>
            </div>
          </div>
        </div>
      );

    case 2: // Graveyard -> 1
      return (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-72 border-x-[16px] border-t-[16px] border-[#1e293b] rounded-t-full bg-slate-900/50 flex flex-col items-center shadow-[0_0_50px_#475569]">
            <div className="absolute inset-x-0 top-10 flex justify-center">
              {/* Iron spikes */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-32 bg-[#0f172a] mx-2" />
              ))}
            </div>
            <div className="absolute top-20">
               <motion.span
                 className="text-8xl font-black text-gray-400 shadow-black drop-shadow-[0_5px_10px_black]"
                 animate={{ opacity: [0.7, 1, 0.7] }}
                 transition={{ repeat: Infinity, duration: 3 }}
               >
                 {targetNumber}
               </motion.span>
            </div>
            <motion.div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-800 to-transparent opacity-80" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} />
          </div>
        </div>
      );

    case 1: // Final Sync
      return null; // The level will transition to the "complete" screen anyway

      
    default:
      return null;
  }
};
