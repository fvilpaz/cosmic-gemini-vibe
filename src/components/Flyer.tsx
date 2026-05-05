import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface FlyerProps {
  x: number;
  y: number;
  isLandscape?: boolean;
  key?: React.Key;
}

export const Flyer = ({ x, y, isLandscape }: FlyerProps) => {
  const groundY = isLandscape ? 40 : 120;
  return (
    <motion.div
      className="absolute"
      style={{ 
        left: x, 
        bottom: groundY - (y || 0),
        transform: isLandscape ? 'scale(1.1)' : 'none'
      }}
      animate={{ 
        y: [0, -15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5,
        ease: "easeInOut"
      }}
    >
      <div className="relative group">
        {/* Pulsing Glow */}
        <motion.div 
          className="absolute inset-0 bg-yellow-400 blur-2xl rounded-full"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        
        {/* Shield Shape (Superman-ish) */}
        <div className="relative w-16 h-16 bg-red-600 border-4 border-yellow-400 rounded-lg transform rotate-45 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.6)]">
          <div className="transform -rotate-45 font-black text-yellow-400 text-3xl italic select-none drop-shadow-md">
            S
          </div>
        </div>

        {/* Outer Ring */}
        <motion.div
          className="absolute -inset-4 border-2 border-white/50 rounded-full"
          animate={{ scale: [0.8, 1.2], opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </div>
    </motion.div>
  );
};
