import { motion, AnimatePresence } from 'motion/react';
import { Level } from '../types';

interface CountdownProps {
  level: Level;
}

export const CountdownDisplay = ({ level }: CountdownProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
           key={level.number}
           initial={{ y: 200, opacity: 0, scale: 0.5, rotateX: 45 }}
           animate={{ y: 0, opacity: 0.15, scale: 1, rotateX: 0 }}
           exit={{ y: -200, opacity: 0, scale: 1.5, rotateX: -45 }}
           transition={{ 
             type: "spring",
             damping: 12,
             stiffness: 100,
             duration: 1
           }}
           className="relative"
        >
          {/* Main Huge Number - Stretched and Cinematic */}
          <h1 className="text-[40vh] md:text-[60vh] font-black leading-none select-none tracking-tighter text-white">
            {level.number}
          </h1>
          
          {/* Planet Name Meta */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-1/4 left-0 w-full text-center"
          >
            <p className={`text-2xl uppercase tracking-[1em] font-light ${level.secondaryColor}`}>
              {level.planetName}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
