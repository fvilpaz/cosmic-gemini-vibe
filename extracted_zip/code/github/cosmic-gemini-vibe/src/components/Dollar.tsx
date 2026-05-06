import React from 'react';
import { motion } from 'motion/react';
import { DollarSign } from 'lucide-react';

interface DollarProps {
  x: number;
  isLandscape?: boolean;
  key?: React.Key;
}

export const Dollar = ({ x, isLandscape }: DollarProps) => {
  return (
    <motion.div 
      className="absolute bottom-[140px] landscape:bottom-[60px] w-12 h-12 flex items-center justify-center z-[25]"
      style={{ 
        left: `${x}px`,
        transform: isLandscape ? 'scale(1.1)' : 'none'
      }}
      animate={{ 
        y: [0, -10, 0],
        rotateY: [0, 360]
      }}
      transition={{ 
        y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        rotateY: { repeat: Infinity, duration: 3, ease: "linear" }
      }}
    >
      <div className="relative w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-2 border-yellow-200 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.5)]">
        <DollarSign className="text-yellow-900 w-6 h-6" />
        <div className="absolute inset-0 rounded-full bg-white/20 blur-[2px] animate-pulse" />
      </div>
    </motion.div>
  );
};
