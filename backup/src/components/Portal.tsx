import { motion } from 'motion/react';

interface PortalProps {
  number: number;
  color: string;
}

export const Portal = ({ number, color }: PortalProps) => {
  return (
    <div className="relative w-64 h-96 flex items-center justify-center">
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      {/* Rotating Ring */}
      <motion.div
        className="absolute inset-0 border-4 border-dashed rounded-full opacity-30"
        style={{ borderColor: color }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />

      {/* The Luminous Number */}
      <motion.div
        className="relative z-10 text-[20rem] font-black leading-none italic select-none"
        style={{ 
          color: 'white',
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}`
        }}
        animate={{ scale: [0.95, 1.05, 0.95], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {number}
      </motion.div>

      {/* Particle Swirl */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            x: [Math.cos(i) * 100, Math.cos(i + 1) * -100],
            y: [Math.sin(i) * 150, Math.sin(i + 1) * -150],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + Math.random(),
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};
