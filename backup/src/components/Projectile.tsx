import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ProjectileProps {
  id: string;
  x: number;
  y: number;
  tier?: number;
  variant?: 'normal' | 'google';
  key?: React.Key;
}

export const TokenProjectile = ({ id, x, y, tier = 1, variant = 'normal' }: ProjectileProps) => {
  const isSuper = tier === 2;
  const isGoogle = variant === 'google';

  if (isGoogle) {
    return (
      <div
        id={`proj-${id}`}
        className="absolute z-40 flex items-center will-change-transform"
        style={{ left: `${x}px`, bottom: `${y}px` }}
      >
        {/* Trail */}
        <motion.div
          animate={{ width: [60, 90, 60], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.25 }}
          className="absolute right-3 h-3 rounded-full bg-gradient-to-l from-blue-400 to-transparent blur-[2px]"
        />
        {/* Google G coin */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 0.3 }}
          className="w-9 h-9 rounded-full bg-white border-2 border-blue-400 shadow-[0_0_18px_rgba(66,133,244,0.9)] flex items-center justify-center z-10"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </motion.div>
        {/* Burst on spawn */}
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute w-9 h-9 rounded-full bg-blue-400 blur-md"
        />
      </div>
    );
  }

  if (isSuper) {
    return (
      <div
        id={`proj-${id}`}
        className="absolute z-40 flex items-center will-change-transform"
        style={{ left: `${x}px`, bottom: `${y}px` }}
      >
        {/* Long golden trail */}
        <motion.div
          animate={{ width: [80, 130, 80], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute right-4 h-5 rounded-full bg-gradient-to-l from-yellow-400 via-orange-500 to-transparent blur-[3px]"
        />
        {/* Super coin */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { repeat: Infinity, duration: 0.4, ease: 'linear' }, scale: { repeat: Infinity, duration: 0.25 } }}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 border-2 border-yellow-200 shadow-[0_0_25px_rgba(251,191,36,1),0_0_50px_rgba(251,191,36,0.5)] flex items-center justify-center z-10 font-black text-white text-xs"
        >
          ✦
        </motion.div>
        {/* Orbiting sparks */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            animate={{ rotate: [deg, deg + 360] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
            className="absolute w-11 h-11"
            style={{ transformOrigin: 'center' }}
          >
            <div className="absolute w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fbbf24]" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
          </motion.div>
        ))}
        {/* Burst */}
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute w-11 h-11 rounded-full bg-orange-400 blur-lg"
        />
      </div>
    );
  }

  // Tier 1 — Gemini token
  return (
    <div
      id={`proj-${id}`}
      className="absolute z-40 flex items-center will-change-transform"
      style={{ left: `${x}px`, bottom: `${y}px` }}
    >
      {/* Trail */}
      <motion.div
        animate={{ width: [50, 75, 50], opacity: [0.25, 0.6, 0.25] }}
        transition={{ repeat: Infinity, duration: 0.2 }}
        className="absolute right-3 h-2.5 rounded-full bg-gradient-to-l from-cyan-400 to-transparent blur-[2px]"
      />
      {/* Token */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 0.25 }}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.9)] flex items-center justify-center z-10 font-black text-white text-[10px]"
      >
        G
      </motion.div>
      {/* Burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute w-8 h-8 rounded-full bg-cyan-400 blur-sm"
      />
    </div>
  );
};
