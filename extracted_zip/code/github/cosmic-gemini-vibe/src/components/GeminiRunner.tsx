import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface RunnerProps {
  isMoving: boolean;
  isJumping: boolean;
  powerLevel?: number; // 0: none, 1: blue (2 shots), 2: super (1 shot)
  isFlying?: boolean;
  isDizzy?: boolean;
  isSitting?: boolean;
  isCowboy?: boolean;
  isShooting?: boolean;
  hideLabel?: boolean;
}

export const GeminiRunner = ({ 
  isMoving, 
  isJumping, 
  powerLevel = 0, 
  isFlying = false, 
  isDizzy = false,
  isSitting = false,
  isCowboy = false,
  isShooting = false,
  hideLabel = false
}: RunnerProps) => {
  const isPoweredUp = powerLevel >= 1;
  const isSuperWarrior = powerLevel === 2;
  const isSuperman = isFlying;
  
  // Power Level Scaling:
  let scale = 0.8; // Level 0: Small
  if (isSuperman) scale = 1.5;
  else if (isSuperWarrior) scale = 1.3;
  else if (isPoweredUp) scale = 1.2;
  
  const supermanColors = isSuperman;

  const getLabelName = () => {
    if (isCowboy) return "COWBOY";
    if (isSuperman) return "ULTRA";
    if (isSuperWarrior) return "PRO";
    if (isPoweredUp) return "FLASH";
    return "NANO";
  };

  const getLabelColor = () => {
    if (isSuperman) return "text-yellow-400 border-yellow-400 bg-yellow-900/50";
    if (isSuperWarrior) return "text-orange-400 border-orange-400 bg-orange-900/50";
    if (isPoweredUp) return "text-blue-200 border-blue-300 bg-blue-900/50";
    return "text-slate-300 border-slate-400 bg-slate-800/80";
  };

  return (
    <motion.div 
      className="relative w-12 h-14 flex flex-col items-center"
      animate={{ 
        scale: isSitting ? 1.5 : scale,
        y: isFlying ? [0, -10, 0] : (isSitting ? 20 : 0),
        x: isDizzy ? [0, -2, 2, 0] : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        y: isFlying ? { repeat: Infinity, duration: 2 } : {},
        x: isDizzy ? { repeat: Infinity, duration: 0.1 } : {}
      }}
    >
      {/* Model Version Label */}
      {!isDizzy && !isSitting && !hideLabel && (
        <motion.div 
          className={cn("absolute -top-6 whitespace-nowrap text-[8px] font-black italic px-2 py-0.5 rounded-full border shadow-lg z-50 pointer-events-none", getLabelColor())}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          GEMINI {getLabelName()}
        </motion.div>
      )}

      {/* Death Stars */}
      {isDizzy && (
        <div className="absolute -top-16 inset-x-0 w-[200%] -left-1/2 flex flex-col items-center justify-center pointer-events-none z-[9999] opacity-100">
          <div className="flex justify-center gap-2">
            <motion.div animate={{ rotate: 360, y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
              <Star className="w-8 h-8 fill-current stroke-current text-yellow-400" />
            </motion.div>
            <motion.div animate={{ rotate: -360, y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
              <Star className="w-8 h-8 fill-current stroke-current text-yellow-400" />
            </motion.div>
            <motion.div animate={{ rotate: 360, y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
              <Star className="w-8 h-8 fill-current stroke-current text-yellow-400" />
            </motion.div>
          </div>
        </div>
      )}

      {/* Power-up Auras */}
      {isPoweredUp && !isDizzy && (
        <div className="absolute inset-0 pointer-events-none z-0">
          
          {/* ULTRA AURA (Superman) */}
          {isSuperman && (
            <>
              <motion.div
                className="absolute -inset-8 blur-xl opacity-80 rounded-full bg-white"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              <motion.div
                className="absolute -inset-12 -top-16 blur-2xl opacity-70 rounded-lg bg-yellow-400"
                animate={{ 
                  scaleY: [1, 1.6, 1],
                  scaleX: [1, 1.2, 1],
                  opacity: [0.5, 0.9, 0.5] 
                }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
              {/* White/Gold Sparkles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute w-1 h-3 bg-white rounded-full"
                  initial={{ opacity: 0, x: "-50%", y: "50%" }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    x: [`${(Math.random()-0.5)*150}%`, `${(Math.random()-0.5)*200}%`],
                    y: [`${(Math.random()-0.5)*150}%`, `${(Math.random()-0.5)*200}%`],
                    rotate: [0, 90, 180]
                  }}
                  transition={{ repeat: Infinity, duration: 0.2 + Math.random()*0.3, delay: Math.random()*2 }}
                  style={{ filter: "drop-shadow(0 0 5px #fff)" }}
                />
              ))}
            </>
          )}

          {/* PRO AURA (Level 2) - Fire Aura */}
          {isSuperWarrior && !isSuperman && (
             <>
               <motion.div
                className="absolute -inset-8 blur-2xl opacity-60 rounded-lg bg-orange-600"
                animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`fire-${i}`}
                  className="absolute bottom-0 left-1/2 rounded-full bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent"
                  initial={{ x: "-50%", y: 0, scale: 0.5, opacity: 0.8 }}
                  animate={{ 
                    y: -40 - Math.random() * 60,
                    x: `${-50 + (Math.random() - 0.5) * 50}%`,
                    scale: [1, 1.5, 0],
                    opacity: [0.8, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: Math.random() * 1 }}
                  style={{ width: '10px', height: '20px', filter: 'blur(2px)' }}
                />
              ))}
             </>
          )}

          {/* FLASH AURA (Level 1) - Blue Glow */}
          {isPoweredUp && !isSuperWarrior && !isSuperman && (
             <>
              <motion.div
                className="absolute -inset-4 blur-xl opacity-60 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`blue-spark-${i}`}
                  className="absolute w-1 h-3 bg-cyan-300 rounded-full"
                  initial={{ opacity: 0, x: "-50%", y: "50%" }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    x: [`${(Math.random()-0.5)*100}%`, `${(Math.random()-0.5)*150}%`],
                    y: [`${(Math.random()-0.5)*100}%`, `${(Math.random()-0.5)*150}%`],
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random()*0.3, delay: Math.random()*2 }}
                  style={{ filter: "drop-shadow(0 0 5px #00f)" }}
                />
              ))}
             </>
          )}
        </div>
      )}

      {/* Head - The Gemini Symbol */}
      <motion.div
        className="relative z-20 w-10 h-10 flex items-center justify-center -mb-2"
        animate={isMoving ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {/* Cowboy Hat */}
        {isCowboy && (
          <div className="absolute -top-4 w-12 h-6 z-30 pointer-events-none">
            <div className="absolute top-2 w-12 h-2 bg-amber-900 rounded-full border border-black shadow-md" />
            <div className="absolute top-0 left-3 w-6 h-4 bg-amber-800 rounded-t-lg border-x border-t border-black" />
            <div className="absolute top-1 left-3.5 w-5 h-1 bg-amber-950 rounded-full opacity-50" />
          </div>
        )}

        <svg viewBox="0 0 24 24" className={cn("w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]", supermanColors ? "fill-white" : "fill-blue-400")}>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" className={cn(supermanColors ? "fill-red-600" : "fill-blue-500")} />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" className={cn(supermanColors ? "fill-blue-600" : "fill-cyan-400")} />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" className={cn(supermanColors ? "fill-red-400" : "fill-blue-200")} />
        </svg>
      </motion.div>

      {/* Body */}
      <div className={cn(
        "relative w-5 h-8 rounded-lg shadow-inner z-10 transition-all", 
        supermanColors ? "bg-gradient-to-b from-blue-700 to-blue-900 border-2 border-red-500" : "bg-gradient-to-b from-blue-400 to-blue-600",
        (isSitting || isCowboy) && "h-4"
      )}>
        <motion.div 
          className={cn("absolute -left-1.5 top-1 w-1.5 h-5 rounded-full origin-top", supermanColors ? "bg-red-600" : "bg-blue-300")}
          animate={isMoving ? { rotate: [-40, 40] } : (isSitting ? { rotate: 80, x: -2 } : (isCowboy ? { rotate: 70, x: -1 } : { rotate: 20 }))}
          transition={isMoving ? { repeat: Infinity, duration: 0.3, repeatType: "mirror" } : {}}
        />
        <motion.div 
          className={cn("absolute -right-1.5 top-1 w-1.5 h-5 rounded-full origin-top flex flex-col items-center justify-end", supermanColors ? "bg-red-600" : "bg-blue-300")}
          animate={isShooting ? { rotate: -90, x: 2 } : isMoving ? { rotate: [40, -40] } : (isSitting ? { rotate: -80, x: 2 } : (isCowboy ? { rotate: -70, x: 1 } : { rotate: -20 }))}
          transition={isMoving ? { repeat: Infinity, duration: 0.3, repeatType: "mirror" } : {}}
        >
          {/* Pistol */}
          {isCowboy && (
            <motion.div 
              className="w-1.5 h-4 bg-gray-800 rounded-sm -mb-2 border border-black shadow-lg origin-bottom"
              animate={isShooting ? { scaleX: [1, 1.2, 1] } : {}}
            >
              <div className="absolute -top-1 w-3 h-1.5 bg-gray-700 rounded-sm border border-black" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Legs */}
      <div className={cn("flex gap-1 justify-center -mt-1", (isSitting || isCowboy) && "mt-[-2px]")}>
        <motion.div 
          className={cn("w-2 h-6 rounded-full origin-top", supermanColors ? "bg-red-700" : "bg-blue-600")}
          animate={isMoving ? { rotate: [30, -30] } : (isSitting || isCowboy ? { rotate: -90, x: -4, y: -2 } : {})}
          transition={isMoving ? { repeat: Infinity, duration: 0.3, repeatType: "mirror" } : {}}
        />
        <motion.div 
          className={cn("w-2 h-6 rounded-full origin-top", supermanColors ? "bg-red-700" : "bg-blue-600")}
          animate={isMoving ? { rotate: [-30, 30] } : (isSitting || isCowboy ? { rotate: 90, x: 4, y: -2 } : {})}
          transition={isMoving ? { repeat: Infinity, duration: 0.3, repeatType: "mirror", delay: 0.15 } : {}}
        />
      </div>

      {/* Shadow removed as per user request */}
    </motion.div>
  );
};
