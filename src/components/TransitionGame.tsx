import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Brain, Sparkles, Cpu, Target } from 'lucide-react';

export const TransitionGame = () => {
  const [shots, setShots] = useState<{ id: number; x: number; y: number }[]>([]);
  const [meteors, setMeteors] = useState<{ id: number; x: number; y: number; type: 'gpt' | 'claude' | 'copilot'; destroyed: boolean }[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const meteorInterval = setInterval(() => {
      const now = Date.now();
      setMeteors(prev => [
        ...prev.filter(m => now - m.id < 4000 && !m.destroyed),
        {
          id: now,
          x: Math.random() * 80 + 10,
          y: -10,
          type: ['gpt', 'claude', 'copilot'][Math.floor(Math.random() * 3)] as any,
          destroyed: false
        }
      ]);
    }, 600);

    const shootInterval = setInterval(() => {
      const now = Date.now();
      setShots(prev => [...prev.filter(s => now - s.id < 800), { id: now, x: 50, y: 80 }]);
    }, 400);

    return () => {
      clearInterval(meteorInterval);
      clearInterval(shootInterval);
    };
  }, []);

  useEffect(() => {
    // Collision detection
    meteors.forEach(m => {
      if (m.destroyed) return;
      shots.forEach(s => {
        const dx = Math.abs(m.x - s.x);
        const dy = Math.abs(m.y - s.y);
        if (dx < 10 && dy < 10) {
          m.destroyed = true;
          setScore(s => s + 1);
        }
      });
    });
  }, [shots, meteors]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {/* Background Stars */}
      {[...Array(50)].map((_, i) => (
        <div
           key={`star-${i}`}
           className="absolute w-0.5 h-0.5 bg-white rounded-full animate-[pulse_1s_ease-in-out_infinite]"
           style={{ 
             top: `${Math.random() * 100}%`, 
             left: `${Math.random() * 100}%`,
             animationDuration: `${Math.random() * 2 + 1}s`
           }}
        />
      ))}

      {/* Ship */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50"
        animate={{ x: '-50%', translateX: ['-60px', '60px', '-60px'] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <div className="relative w-16 h-20 flex flex-col items-center">
          {/* Main Body */}
          <div className="w-10 h-16 bg-white rounded-t-full border-2 border-slate-300 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)]">
             {/* Google G Colors */}
             <div className="absolute top-0 left-0 w-full h-1/4 bg-blue-500" />
             <div className="absolute top-1/4 left-0 w-full h-1/4 bg-red-500" />
             <div className="absolute top-2/4 left-0 w-full h-1/4 bg-yellow-500" />
             <div className="absolute top-3/4 left-0 w-full h-1/4 bg-green-500" />
             <div className="absolute inset-2 bg-white rounded-t-full flex items-center justify-center font-black text-slate-800 text-lg">G</div>
          </div>
          {/* Wings */}
          <div className="absolute bottom-4 -left-4 w-6 h-8 bg-slate-200 border-2 border-slate-300 rounded-l-full rotate-[-20deg]" />
          <div className="absolute bottom-4 -right-4 w-6 h-8 bg-slate-200 border-2 border-slate-300 rounded-r-full rotate-[20deg]" />
          
          {/* Thrusters */}
          <div className="flex justify-between w-full absolute -bottom-4 px-2">
             <motion.div 
                className="w-3 h-8 bg-blue-400 rounded-full blur-[1px]"
                animate={{ scaleY: [1, 2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.1 }}
             />
             <motion.div 
                className="w-3 h-8 bg-blue-400 rounded-full blur-[1px]"
                animate={{ scaleY: [1, 2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.1, delay: 0.05 }}
             />
          </div>
        </div>
      </motion.div>

      {/* Shots */}
      {shots.map((s, i) => {
        const colors = ['bg-blue-400', 'bg-red-400', 'bg-yellow-400', 'bg-green-400'];
        const colorClass = colors[i % colors.length];
        return (
          <motion.div
            key={s.id}
            className={`absolute w-1.5 h-6 ${colorClass} shadow-[0_0_15px_currentColor] rounded-full`}
            initial={{ left: `50%`, bottom: '110px' }}
            animate={{ bottom: '110%' }}
            transition={{ duration: 0.8, ease: 'linear' }}
          />
        );
      })}

      {/* Meteors */}
      <AnimatePresence>
        {meteors.map(m => !m.destroyed && (
          <motion.div
            key={m.id}
            className="absolute flex flex-col items-center"
            initial={{ left: `${m.x}%`, top: '-10%' }}
            animate={{ top: '110%', rotate: 360 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ top: { duration: 4, ease: 'linear' }, rotate: { duration: 4, repeat: Infinity, ease: 'linear' } }}
          >
            <div className="relative w-10 h-10 bg-stone-700 rounded-full border-2 border-stone-600 flex items-center justify-center overflow-hidden">
               <div className="absolute top-1 left-1 w-2 h-2 bg-stone-800 rounded-full" />
               <div className="absolute bottom-2 right-2 w-3 h-3 bg-stone-800 rounded-full" />
               <div className="scale-75 opacity-60">
                 {m.type === 'gpt' && <Brain />}
                 {m.type === 'claude' && <Sparkles />}
                 {m.type === 'copilot' && <Cpu />}
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Score */}
      <div className="absolute top-10 right-10 font-mono text-white/40 text-xl">
        METEORS DEPLOYED: {score}
      </div>
    </div>
  );
};
